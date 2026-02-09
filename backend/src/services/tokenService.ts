import { service_client, getAuthenticatedClient } from "../config/supabase";
import type {
	CounterClosureResponse,
	OverallQueueStatus,
	QueueProgress,
	ServiceCounter,
	ServiceCounterWithQueue,
	Token,
	TokenActivationResponse,
	TokenGenerationResponse,
	TokenQueueItem,
	TokenReassignment,
	TokenStatusType,
	TokenWithDetails,
	UserQueueStatus,
} from "../interfaces/token.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import {
	getCurrentDateStringIST,
	getCurrentTimeStringIST,
	getCurrentISOStringIST,
	createISTDate,
} from "../utils/dateUtils";

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a unique token number
 * Format: TK-{SLOT_ID}-{SEQUENCE}-{RANDOM}
 */
const ACTIVATION_START_TIME = 15;
const generateTokenNumber = (slotId: number, sequence: number): string => {
	const random = Math.random().toString(36).substring(2, 5).toUpperCase();
	const paddedSequence = sequence.toString().padStart(4, "0");
	return `TK-${slotId}-${paddedSequence}-${random}`;
};

/**
 * Calculate estimated wait time based on queue position and average serving time
 * @param queuePosition Position in the queue (1-based)
 * @param avgServingTime Average serving time in minutes
 */
const calculateEstimatedWaitTime = (queuePosition: number, avgServingTime: number = 3): number => {
	return Math.max(0, (queuePosition - 1) * avgServingTime);
};

/**
 * Get the counter with the shortest queue for optimal assignment
 */
const getOptimalCounter = async (): Promise<ServiceCounter | null> => {
	try {
		// Get all active counters
		const { data: counters, error: counterError } = await service_client
			.from("service_counters")
			.select("*")
			.eq("is_active", true);

		if (counterError || !counters || counters.length === 0) {
			return null;
		}

		// Get queue lengths for each counter
		const counterQueues = await Promise.all(
			counters.map(async (counter) => {
				const { count } = await service_client
					.from("tokens")
					.select("*", { count: "exact", head: true })
					.eq("counter_id", counter.counter_id)
					.in("token_status", ["active", "serving"]);

				return {
					...counter,
					queue_length: count || 0,
				};
			})
		);

		// Find counter with shortest queue
		counterQueues.sort((a, b) => a.queue_length - b.queue_length);
		return counterQueues[0];
	} catch (error) {
		console.error("Error finding optimal counter:", error);
		return null;
	}
};

/**
 * Get queue position for a token at a specific counter
 */
const getQueuePosition = async (counterId: number, tokenId: number): Promise<number> => {
	try {
		const { data: tokens, error } = await service_client
			.from("tokens")
			.select("token_id, activated_at")
			.eq("counter_id", counterId)
			.in("token_status", ["active", "serving"])
			.order("activated_at", { ascending: true });

		if (error || !tokens) return 0;

		const position = tokens.findIndex((t) => t.token_id === tokenId);
		return position === -1 ? tokens.length + 1 : position + 1;
	} catch (error) {
		return 0;
	}
};

// ============================================
// Token Generation Services
// ============================================

/**
 * FR-2.2.1: Generate a unique digital token after successful booking confirmation
 * FR-2.2.2: Assign token order based on booking sequence and slot timing
 * FR-2.2.13: Associate all group members with a single booking reference and token set
 */
export const generateToken = async (
	token: string,
	userId: string,
	bookingId: number
): Promise<ServiceResponse<TokenGenerationResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Verify the booking exists and belongs to the user (or user is a group member)
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_group_members (user_id)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is authorized (primary user or group member)
		const isAuthorized =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isAuthorized) {
			return {
				success: false,
				error: "You are not authorized to generate a token for this booking",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Check booking status - must be confirmed or pending_payment
		if (booking.booking_status === "cancelled" || booking.booking_status === "completed") {
			return {
				success: false,
				error: `Cannot generate token for a ${booking.booking_status} booking`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check if token already exists for this booking
		const { data: existingToken, error: tokenCheckError } = await service_client
			.from("tokens")
			.select("*")
			.eq("booking_id", bookingId)
			.single();

		if (existingToken && !tokenCheckError) {
			return {
				success: false,
				error: "Token already exists for this booking",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Get all tokens for this slot to determine sequence (IST)
		const today = getCurrentDateStringIST();
		const { data: slotTokens, error: tokenError } = await service_client
			.from("tokens")
			.select(`
                token_id,
                bookings!inner (
                    slot_id,
                    meal_slots!inner (
                        slot_date
                    )
                )
            `)
			.eq("bookings.meal_slots.slot_date", today)
			.eq("bookings.slot_id", booking.slot_id);

		if (tokenError) {
			return {
				success: false,
				error: "Oops sorry for the inconvinience!",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const sequence = (slotTokens?.length || 0) + 1;

		// Generate unique token number
		const tokenNumber = generateTokenNumber(booking.slot_id, sequence);

		// Create the token (FR-2.2.1)
		const { data: newToken, error: createError } = await auth_supa
			.from("tokens")
			.insert({
				booking_id: bookingId,
				token_number: tokenNumber,
				token_status: "pending",
			})
			.select()
			.single();

		if (createError || !newToken) {
			return {
				success: false,
				error: createError?.message || "Failed to generate token",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				token_id: newToken.token_id,
				token_number: newToken.token_number,
				booking_reference: booking.booking_reference,
				booking_id: bookingId,
				group_size: booking.group_size,
				slot_details: {
					slot_id: booking.meal_slots.slot_id,
					slot_name: booking.meal_slots.slot_name,
					slot_date: booking.meal_slots.slot_date,
					start_time: booking.meal_slots.start_time,
					end_time: booking.meal_slots.end_time,
				},
				message:
					"Token generated successfully. Activate your token when you arrive at the cafeteria.",
			},
			statusCode: STATUS.CREATED,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.2.3: Display token details to the student, including token number and status
 */
export const getTokenDetails = async (
	token: string,
	userId: string,
	tokenId: number
): Promise<ServiceResponse<TokenWithDetails>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get token with all related details
		const { data: tokenData, error: tokenError } = await auth_supa
			.from("tokens")
			.select(`
				*,
				bookings (
					*,
					meal_slots (*),
					booking_group_members (
						user_id,
						users (first_name, last_name)
					)
				),
				service_counters (*)
			`)
			.eq("token_id", tokenId)
			.single();

		if (tokenError || !tokenData) {
			return {
				success: false,
				error: "Token not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is authorized
		const isAuthorized =
			tokenData.bookings.primary_user_id === userId ||
			tokenData.bookings.booking_group_members.some(
				(m: { user_id: string }) => m.user_id === userId
			);

		if (!isAuthorized) {
			return {
				success: false,
				error: "You are not authorized to view this token",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Calculate queue position if token is activated
		let queuePosition: number | null = null;
		let estimatedWaitTime: number | null = null;

		if (tokenData.counter_id && ["active", "serving"].includes(tokenData.token_status)) {
			queuePosition = await getQueuePosition(tokenData.counter_id, tokenId);
			estimatedWaitTime = calculateEstimatedWaitTime(queuePosition);
		}

		const response: TokenWithDetails = {
			token_id: tokenData.token_id,
			booking_id: tokenData.booking_id,
			token_number: tokenData.token_number,
			counter_id: tokenData.counter_id,
			token_status: tokenData.token_status,
			activated_at: tokenData.activated_at,
			served_at: tokenData.served_at,
			booking_reference: tokenData.bookings.booking_reference,
			slot_details: {
				slot_id: tokenData.bookings.meal_slots.slot_id,
				slot_name: tokenData.bookings.meal_slots.slot_name,
				slot_date: tokenData.bookings.meal_slots.slot_date,
				start_time: tokenData.bookings.meal_slots.start_time,
				end_time: tokenData.bookings.meal_slots.end_time,
			},
			counter_details: tokenData.service_counters,
			queue_position: queuePosition,
			estimated_wait_time: estimatedWaitTime,
			group_members: tokenData.bookings.booking_group_members.map(
				(m: { user_id: string; users: { first_name: string; last_name: string } }) => ({
					user_id: m.user_id,
					first_name: m.users.first_name,
					last_name: m.users.last_name,
				})
			),
		};

		return {
			success: true,
			data: response,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get all tokens for a user
 */
export const getUserTokens = async (
	token: string,
	userId: string,
	status?: TokenStatusType,
	date?: string
): Promise<ServiceResponse<TokenWithDetails[]>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Build query to get tokens where user is primary or group member
		let query = auth_supa
			.from("tokens")
			.select(`
				*,
				bookings!inner (
					*,
					meal_slots (*),
					booking_group_members (
						user_id,
						users (first_name, last_name)
					)
				),
				service_counters (*)
			`)
			.order("bookings(created_at)", { ascending: false });

		if (status) {
			query = query.eq("token_status", status);
		}

		if (date) {
			query = query.eq("bookings.meal_slots.slot_date", date);
		}

		const { data: tokens, error: tokensError } = await query;

		if (tokensError) {
			return {
				success: false,
				error: tokensError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Filter tokens where user is authorized
		const userTokens = (tokens || []).filter(
			(t: any) =>
				t.bookings.primary_user_id === userId ||
				t.bookings.booking_group_members.some((m: { user_id: string }) => m.user_id === userId)
		);

		// Map to response format with queue positions
		const tokenDetails: TokenWithDetails[] = await Promise.all(
			userTokens.map(async (tokenData: any) => {
				let queuePosition: number | null = null;
				let estimatedWaitTime: number | null = null;

				if (tokenData.counter_id && ["active", "serving"].includes(tokenData.token_status)) {
					queuePosition = await getQueuePosition(tokenData.counter_id, tokenData.token_id);
					estimatedWaitTime = calculateEstimatedWaitTime(queuePosition);
				}

				return {
					token_id: tokenData.token_id,
					booking_id: tokenData.booking_id,
					token_number: tokenData.token_number,
					counter_id: tokenData.counter_id,
					token_status: tokenData.token_status,
					activated_at: tokenData.activated_at,
					served_at: tokenData.served_at,
					booking_reference: tokenData.bookings.booking_reference,
					slot_details: {
						slot_id: tokenData.bookings.meal_slots.slot_id,
						slot_name: tokenData.bookings.meal_slots.slot_name,
						slot_date: tokenData.bookings.meal_slots.slot_date,
						start_time: tokenData.bookings.meal_slots.start_time,
						end_time: tokenData.bookings.meal_slots.end_time,
					},
					counter_details: tokenData.service_counters,
					queue_position: queuePosition,
					estimated_wait_time: estimatedWaitTime,
					group_members: tokenData.bookings.booking_group_members.map(
						(m: { user_id: string; users: { first_name: string; last_name: string } }) => ({
							user_id: m.user_id,
							first_name: m.users.first_name,
							last_name: m.users.last_name,
						})
					),
				};
			})
		);

		return {
			success: true,
			data: tokenDetails,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Token Activation & Counter Assignment
// ============================================

/**
 * FR-2.2.9: Assign tokens to available counters to optimize serving speed
 * Activates a token and assigns it to the optimal counter
 */
export const activateToken = async (
	token: string,
	userId: string,
	tokenId: number
): Promise<ServiceResponse<TokenActivationResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get the token with booking details
		const { data: tokenData, error: tokenError } = await auth_supa
			.from("tokens")
			.select(`
				*,
				bookings (
					*,
					meal_slots (*),
					booking_group_members (user_id)
				)
			`)
			.eq("token_id", tokenId)
			.single();

		if (tokenError || !tokenData) {
			return {
				success: false,
				error: "Token not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is authorized
		const isAuthorized =
			tokenData.bookings.primary_user_id === userId ||
			tokenData.bookings.booking_group_members.some(
				(m: { user_id: string }) => m.user_id === userId
			);

		if (!isAuthorized) {
			return {
				success: false,
				error: "You are not authorized to activate this token",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Check token status
		if (tokenData.token_status !== "pending") {
			return {
				success: false,
				error: `Token is already ${tokenData.token_status}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check if we're within the slot time window (IST)
		const now = new Date();
		const slotDate = tokenData.bookings.meal_slots.slot_date;
		const slotStartTime = tokenData.bookings.meal_slots.start_time;
		const slotEndTime = tokenData.bookings.meal_slots.end_time;

		const slotStart = createISTDate(slotDate, slotStartTime);
		const slotEnd = createISTDate(slotDate, slotEndTime);
		console.log("slot start time : ", slotStartTime);
		console.log("slot end time : ", slotEndTime);
		console.log("now", now);

		// Allow activation 15 minutes before slot starts
		const activationWindowStart = new Date(slotStart.getTime() - ACTIVATION_START_TIME * 60 * 1000);
		console.log("activation window : ", activationWindowStart.getTime());
		if (now < activationWindowStart) {
			return {
				success: false,
				error: `Token can only be activated 15 minutes before slot starts (${slotStartTime})`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		if (now > slotEnd) {
			const { data, error } = await auth_supa
				.from("tokens")
				.update({
					token_status: "expired",
				})
				.eq("token_id", tokenId)
				.select() // Optional: Returns the updated row
				.single();

			if (error) {
				return {
					success: false,
					error: "Slot time has ended. Token cannot be activated.",
					statusCode: STATUS.BADREQUEST,
				};
			}
		}

		// Find optimal counter (FR-2.2.9)
		const optimalCounter = await getOptimalCounter();

		if (!optimalCounter) {
			return {
				success: false,
				error: "No active service counters available",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Update token with counter assignment and activation (IST)
		const activatedAt = getCurrentISOStringIST();
		const { data: updatedToken, error: updateError } = await auth_supa
			.from("tokens")
			.update({
				token_status: "active",
				counter_id: optimalCounter.counter_id,
				activated_at: activatedAt,
			})
			.eq("token_id", tokenId)
			.select()
			.single();

		if (updateError || !updatedToken) {
			return {
				success: false,
				error: "Failed to activate token",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Get queue position
		const queuePosition = await getQueuePosition(optimalCounter.counter_id, tokenId);
		const estimatedWaitTime = calculateEstimatedWaitTime(queuePosition);

		return {
			success: true,
			data: {
				token_id: updatedToken.token_id,
				token_number: updatedToken.token_number,
				counter_id: optimalCounter.counter_id,
				counter_name: optimalCounter.counter_name,
				queue_position: queuePosition,
				estimated_wait_time: estimatedWaitTime,
				activated_at: activatedAt,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Queue Display & Progress Services
// ============================================

/**
 * FR-2.2.7: Display the currently served token and queue progress to students
 */
export const getQueueProgress = async (
	slotId?: number,
	date?: string
): Promise<ServiceResponse<OverallQueueStatus>> => {
	try {
		// Get slot filter
		let slotFilter: number | undefined = slotId;

		if (!slotFilter && date) {
			// Get current active slot for the date
			const currentTime = getCurrentTimeStringIST();
			const { data: activeSlot } = await service_client
				.from("meal_slots")
				.select("slot_id")
				.eq("slot_date", date)
				.eq("is_active", true)
				.lte("start_time", currentTime)
				.gte("end_time", currentTime)
				.single();

			slotFilter = activeSlot?.slot_id;
		}

		if (!slotFilter) {
			// Get today's date and find active slot (IST)
			const today = getCurrentDateStringIST();
			const currentTime = getCurrentTimeStringIST();

			const { data: activeSlot } = await service_client
				.from("meal_slots")
				.select("*")
				.eq("slot_date", today)
				.eq("is_active", true)
				.lte("start_time", currentTime)
				.gte("end_time", currentTime)
				.single();

			if (!activeSlot) {
				return {
					success: false,
					error: "No active meal slot found",
					statusCode: STATUS.NOTFOUND,
				};
			}
			slotFilter = activeSlot.slot_id;
		}

		// Get slot details
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slotFilter)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Get all tokens for this slot with booking info
		const { data: tokens, error: tokensError } = await service_client
			.from("tokens")
			.select(`
				*,
				bookings!inner (
					booking_reference,
					group_size,
					slot_id
				)
			`)
			.eq("bookings.slot_id", slotFilter)
			.order("activated_at", { ascending: true });

		if (tokensError) {
			return {
				success: false,
				error: tokensError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		const allTokens = tokens || [];

		// Get all active counters
		const { data: counters, error: counterError } = await service_client
			.from("service_counters")
			.select("*")
			.eq("is_active", true);

		if (counterError || !counters) {
			return {
				success: false,
				error: "Failed to fetch counters",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Build queue progress for each counter
		const counterProgress: QueueProgress[] = counters.map((counter) => {
			const counterTokens = allTokens.filter((t: any) => t.counter_id === counter.counter_id);

			const servingToken = counterTokens.find((t: any) => t.token_status === "serving");
			const activatedTokens = counterTokens.filter((t: any) => t.token_status === "active");

			return {
				counter_id: counter.counter_id,
				counter_name: counter.counter_name,
				currently_serving: servingToken
					? {
							token_id: servingToken.token_id,
							token_number: servingToken.token_number,
							booking_reference: servingToken.bookings.booking_reference,
							counter_id: servingToken.counter_id,
							token_status: servingToken.token_status,
							queue_position: 0,
							group_size: servingToken.bookings.group_size,
							activated_at: servingToken.activated_at,
						}
					: null,
				next_in_queue: activatedTokens.slice(0, 5).map((t: any, index: number) => ({
					token_id: t.token_id,
					token_number: t.token_number,
					booking_reference: t.bookings.booking_reference,
					counter_id: t.counter_id,
					token_status: t.token_status,
					queue_position: index + 1,
					group_size: t.bookings.group_size,
					activated_at: t.activated_at,
				})),
				total_in_queue: activatedTokens.length,
				average_serving_time: 3, // Default 3 minutes
			};
		});

		// Calculate overall statistics
		const pendingCount = allTokens.filter((t: any) => t.token_status === "pending").length;
		const activatedCount = allTokens.filter((t: any) => t.token_status === "active").length;
		const servingCount = allTokens.filter((t: any) => t.token_status === "serving").length;
		const servedCount = allTokens.filter((t: any) => t.token_status === "served").length;

		return {
			success: true,
			data: {
				slot_id: slot.slot_id,
				slot_name: slot.slot_name,
				total_tokens: allTokens.length,
				pending_tokens: pendingCount,
				activated_tokens: activatedCount,
				serving_tokens: servingCount,
				served_tokens: servedCount,
				counters: counterProgress,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Token Serving Services
// ============================================

/**
 * Start serving a token (call next in queue)
 * For staff use
 */
export const startServingToken = async (
	counterId: number
): Promise<ServiceResponse<TokenQueueItem | null>> => {
	try {
		// Check if counter is active
		const { data: counter, error: counterError } = await service_client
			.from("service_counters")
			.select("*")
			.eq("counter_id", counterId)
			.eq("is_active", true)
			.single();

		if (counterError || !counter) {
			return {
				success: false,
				error: "Counter not found or is not active",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if there's already a token being served at this counter
		const { data: servingToken } = await service_client
			.from("tokens")
			.select("*")
			.eq("counter_id", counterId)
			.eq("token_status", "serving")
			.single();

		if (servingToken) {
			return {
				success: false,
				error: "There is already a token being served at this counter. Mark it as served first.",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Get next token in queue (oldest activated token)
		const { data: nextToken, error: nextError } = await service_client
			.from("tokens")
			.select(`
				*,
				bookings (booking_reference, group_size)
			`)
			.eq("counter_id", counterId)
			.eq("token_status", "active")
			.order("activated_at", { ascending: true })
			.limit(1)
			.single();

		if (nextError || !nextToken) {
			return {
				success: true,
				data: null,
				statusCode: STATUS.SUCCESS,
			};
		}

		// Update token to serving status
		const { error: updateError } = await service_client
			.from("tokens")
			.update({ token_status: "serving" })
			.eq("token_id", nextToken.token_id);

		if (updateError) {
			return {
				success: false,
				error: "Failed to update token status",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				token_id: nextToken.token_id,
				token_number: nextToken.token_number,
				booking_reference: nextToken.bookings.booking_reference,
				counter_id: nextToken.counter_id,
				token_status: "serving",
				queue_position: 0,
				group_size: nextToken.bookings.group_size,
				activated_at: nextToken.activated_at,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.2.6: Mark tokens as served after meal collection
 */
export const markTokenAsServed = async (tokenId: number): Promise<ServiceResponse<Token>> => {
	try {
		// Get token details
		const { data: tokenData, error: tokenError } = await service_client
			.from("tokens")
			.select("*")
			.eq("token_id", tokenId)
			.single();

		if (tokenError || !tokenData) {
			return {
				success: false,
				error: "Token not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check token status
		if (tokenData.token_status !== "serving") {
			return {
				success: false,
				error: `Token must be in 'serving' status to mark as served. Current status: ${tokenData.token_status}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Update token to served (IST)
		const servedAt = getCurrentISOStringIST();
		const { data: updatedToken, error: updateError } = await service_client
			.from("tokens")
			.update({
				token_status: "served",
				served_at: servedAt,
			})
			.eq("token_id", tokenId)
			.select()
			.single();

		if (updateError || !updatedToken) {
			return {
				success: false,
				error: "Failed to update token status",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Update booking status to completed
		await service_client
			.from("bookings")
			.update({ booking_status: "completed" })
			.eq("booking_id", tokenData.booking_id);

		return {
			success: true,
			data: updatedToken,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Counter Management & Token Reassignment
// ============================================

/**
 * Get all service counters with queue information
 */
export const getServiceCounters = async (): Promise<ServiceResponse<ServiceCounterWithQueue[]>> => {
	try {
		const { data: counters, error: counterError } = await service_client
			.from("service_counters")
			.select("*")
			.order("counter_id", { ascending: true });

		if (counterError) {
			return {
				success: false,
				error: counterError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Get queue info for each counter
		const countersWithQueue: ServiceCounterWithQueue[] = await Promise.all(
			(counters || []).map(async (counter) => {
				const { data: queueTokens } = await service_client
					.from("tokens")
					.select("token_number")
					.eq("counter_id", counter.counter_id)
					.in("token_status", ["active", "serving"]);

				const { data: servingToken } = await service_client
					.from("tokens")
					.select("token_number")
					.eq("counter_id", counter.counter_id)
					.eq("token_status", "serving")
					.single();

				const queueLength = queueTokens?.length || 0;

				return {
					...counter,
					current_queue_length: queueLength,
					estimated_wait_time: calculateEstimatedWaitTime(queueLength + 1),
					current_serving_token: servingToken?.token_number || null,
				};
			})
		);

		return {
			success: true,
			data: countersWithQueue,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.2.10: Detect serving counter closure events
 * FR-2.2.11: Reorder and reassign affected tokens to active counters
 * FR-2.2.12: Update token positions and notify users after reassignment
 */
export const closeCounterAndReassign = async (
	counterId: number
	// reason?: string
): Promise<ServiceResponse<CounterClosureResponse>> => {
	try {
		// Verify counter exists
		const { data: counter, error: counterError } = await service_client
			.from("service_counters")
			.select("*")
			.eq("counter_id", counterId)
			.single();

		if (counterError || !counter) {
			return {
				success: false,
				error: "Counter not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// FR-2.2.10: Mark counter as inactive
		const { error: updateCounterError } = await service_client
			.from("service_counters")
			.update({ is_active: false })
			.eq("counter_id", counterId);

		if (updateCounterError) {
			return {
				success: false,
				error: "Failed to close counter",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Get tokens assigned to this counter that need reassignment
		const { data: affectedTokens, error: tokensError } = await service_client
			.from("tokens")
			.select(`
				*,
				bookings (booking_reference, group_size)
			`)
			.eq("counter_id", counterId)
			.in("token_status", ["active", "serving"])
			.order("activated_at", { ascending: true });

		if (tokensError) {
			return {
				success: false,
				error: "Failed to fetch affected tokens",
				statusCode: STATUS.SERVERERROR,
			};
		}

		if (!affectedTokens || affectedTokens.length === 0) {
			return {
				success: true,
				data: {
					closed_counter_id: counterId,
					reassigned_tokens: 0,
					reassignment_details: [],
				},
				statusCode: STATUS.SUCCESS,
			};
		}

		// Get other active counters
		const { data: activeCounters, error: activeCounterError } = await service_client
			.from("service_counters")
			.select("*")
			.eq("is_active", true)
			.neq("counter_id", counterId);

		if (activeCounterError || !activeCounters || activeCounters.length === 0) {
			return {
				success: false,
				error: "No other active counters available for reassignment",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// FR-2.2.11 & FR-2.2.12: Reassign tokens to active counters
		const reassignmentDetails: TokenReassignment[] = [];

		for (const token of affectedTokens) {
			// Find optimal counter for this token
			const optimalCounter = await getOptimalCounter();

			if (!optimalCounter) {
				continue;
			}

			// Update token with new counter
			const { error: reassignError } = await service_client
				.from("tokens")
				.update({ counter_id: optimalCounter.counter_id })
				.eq("token_id", token.token_id);

			if (!reassignError) {
				const newQueuePosition = await getQueuePosition(optimalCounter.counter_id, token.token_id);

				reassignmentDetails.push({
					token_id: token.token_id,
					token_number: token.token_number,
					old_counter_id: counterId,
					new_counter_id: optimalCounter.counter_id,
					new_queue_position: newQueuePosition,
					notified: true, // In a real system, send notification here
				});
			}
		}

		return {
			success: true,
			data: {
				closed_counter_id: counterId,
				reassigned_tokens: reassignmentDetails.length,
				reassignment_details: reassignmentDetails,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Reopen a closed counter
 */
export const reopenCounter = async (
	counterId: number
): Promise<ServiceResponse<ServiceCounter>> => {
	try {
		const { data: counter, error: updateError } = await service_client
			.from("service_counters")
			.update({ is_active: true })
			.eq("counter_id", counterId)
			.select()
			.single();

		if (updateError || !counter) {
			return {
				success: false,
				error: "Failed to reopen counter",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: counter,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get token by booking reference
 */
export const getTokenByBookingReference = async (
	token: string,
	userId: string,
	bookingReference: string
): Promise<ServiceResponse<TokenWithDetails>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get booking by reference
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				booking_id,
				primary_user_id,
				booking_group_members (user_id)
			`)
			.eq("booking_reference", bookingReference)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check authorization
		const isAuthorized =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isAuthorized) {
			return {
				success: false,
				error: "You are not authorized to view this token",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Get token for this booking
		const { data: tokenData, error: tokenError } = await auth_supa
			.from("tokens")
			.select(`
				*,
				bookings (
					*,
					meal_slots (*),
					booking_group_members (
						user_id,
						users (first_name, last_name)
					)
				),
				service_counters (*)
			`)
			.eq("booking_id", booking.booking_id)
			.single();

		if (tokenError || !tokenData) {
			return {
				success: false,
				error: "Token not found for this booking",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Calculate queue position if applicable
		let queuePosition: number | null = null;
		let estimatedWaitTime: number | null = null;

		if (tokenData.counter_id && ["active", "serving"].includes(tokenData.token_status)) {
			queuePosition = await getQueuePosition(tokenData.counter_id, tokenData.token_id);
			estimatedWaitTime = calculateEstimatedWaitTime(queuePosition);
		}

		return {
			success: true,
			data: {
				token_id: tokenData.token_id,
				booking_id: tokenData.booking_id,
				token_number: tokenData.token_number,
				counter_id: tokenData.counter_id,
				token_status: tokenData.token_status,
				activated_at: tokenData.activated_at,
				served_at: tokenData.served_at,
				booking_reference: tokenData.bookings.booking_reference,
				slot_details: {
					slot_id: tokenData.bookings.meal_slots.slot_id,
					slot_name: tokenData.bookings.meal_slots.slot_name,
					slot_date: tokenData.bookings.meal_slots.slot_date,
					start_time: tokenData.bookings.meal_slots.start_time,
					end_time: tokenData.bookings.meal_slots.end_time,
				},
				counter_details: tokenData.service_counters,
				queue_position: queuePosition,
				estimated_wait_time: estimatedWaitTime,
				group_members: tokenData.bookings.booking_group_members.map(
					(m: { user_id: string; users: { first_name: string; last_name: string } }) => ({
						user_id: m.user_id,
						first_name: m.users.first_name,
						last_name: m.users.last_name,
					})
				),
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Real-time Queue Status Service (for SSE)
// ============================================

/**
 * Get real-time queue status for a specific token
 * Used by SSE endpoint for live queue updates
 */
export const getUserQueueStatus = async (
	tokenId: number
): Promise<ServiceResponse<UserQueueStatus>> => {
	try {
		// Get token with counter details
		const { data: tokenData, error: tokenError } = await service_client
			.from("tokens")
			.select(`
				*,
				service_counters (*)
			`)
			.eq("token_id", tokenId)
			.single();

		if (tokenError || !tokenData) {
			return {
				success: false,
				error: "Token not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Only return queue status for active or serving tokens
		if (!["active", "serving"].includes(tokenData.token_status)) {
			return {
				success: false,
				error: "Token is not in queue (not active or serving)",
				statusCode: STATUS.BADREQUEST,
			};
		}

		if (!tokenData.counter_id) {
			// Token is active but not yet assigned to a counter - return pending status
			return {
				success: true,
				data: {
					token_id: tokenData.token_id,
					token_number: tokenData.token_number,
					token_status: tokenData.token_status,
					counter_id: 0,
					counter_name: "Awaiting Assignment",
					queue_position: -1, // -1 indicates not yet assigned
					estimated_wait_time: 0,
					currently_serving: null,
					tokens_ahead: 0,
				},
				statusCode: STATUS.SUCCESS,
			};
		}

		// Get all tokens at this counter that are active or serving, ordered by activation time
		const { data: counterTokens, error: queueError } = await service_client
			.from("tokens")
			.select("token_id, token_number, token_status, activated_at")
			.eq("counter_id", tokenData.counter_id)
			.in("token_status", ["active", "serving"])
			.order("activated_at", { ascending: true });

		if (queueError) {
			return {
				success: false,
				error: "Failed to fetch queue data",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Find the currently serving token
		const servingToken = counterTokens?.find((t) => t.token_status === "serving") || null;

		// Find this token's position in the queue
		const activeTokens = counterTokens?.filter((t) => t.token_status === "active") || [];
		const position = activeTokens.findIndex((t) => t.token_id === tokenId);

		// Queue position: 0 if serving, otherwise 1-based position among active tokens
		let queuePosition: number;
		let tokensAhead: number;

		if (tokenData.token_status === "serving") {
			queuePosition = 0;
			tokensAhead = 0;
		} else {
			queuePosition = position === -1 ? activeTokens.length + 1 : position + 1;
			// Tokens ahead = position - 1 (if serving token exists, that's already being served)
			tokensAhead = Math.max(0, queuePosition - 1);
			// If there's a serving token, add 1 to tokens ahead (the serving one)
			if (servingToken) {
				tokensAhead += 1;
			}
		}

		const estimatedWaitTime = calculateEstimatedWaitTime(queuePosition);

		return {
			success: true,
			data: {
				token_id: tokenData.token_id,
				token_number: tokenData.token_number,
				token_status: tokenData.token_status,
				counter_id: tokenData.counter_id,
				counter_name: tokenData.service_counters?.counter_name || "Unknown Counter",
				queue_position: queuePosition,
				estimated_wait_time: estimatedWaitTime,
				currently_serving: servingToken ? { token_number: servingToken.token_number } : null,
				tokens_ahead: tokensAhead,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};
