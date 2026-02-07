import { service_client, getAuthenticatedClient } from "../config/supabase";
import type {
	Booking,
	BookingConfirmation,
	BookingGroupMember,
	BookingMenuItem,
	BookingResponse,
	CreateBookingRequest,
	DemandAnalysis,
	MealSlot,
	MealSlotWithAvailability,
	MenuItem,
	SlotCapacityUpdate,
	SlotMenuItem,
	SlotRecommendation,
	UpdateBookingRequest,
} from "../interfaces/booking.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import {
	getCurrentDateStringIST,
	createISTISOString,
	formatDateOnly,
	getCurrentDateIST,
} from "../utils/dateUtils";

// Helper function to generate booking reference
export const generateBookingReference = (): string => {
	const timestamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `BK-${timestamp}-${random}`;
};

// Helper function to calculate payment deadline (e.g., 30 minutes before slot starts)
const calculatePaymentDeadline = (slotDate: string, paymentWindowEnd: string): string => {
	return createISTISOString(slotDate, paymentWindowEnd);
};

/**
 * FR-2.1.1: Get available meal slots with remaining capacity
 */
export const getAvailableSlots = async (
	date?: string,
	mealType?: string
): Promise<ServiceResponse<MealSlotWithAvailability[]>> => {
	try {
		let query = service_client
			.from("meal_slots")
			.select("*")
			.eq("is_active", true)
			.order("slot_date", { ascending: true })
			.order("start_time", { ascending: true });

		if (date) {
			query = query.eq("slot_date", date);
		} else {
			// Default to today and future dates (IST)
			const today = getCurrentDateStringIST();
			query = query.gte("slot_date", today);
		}

		if (mealType) {
			query = query.ilike("slot_name", `%${mealType}%`);
		}

		const { data: slots, error } = await query;

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		const slotsWithAvailability: MealSlotWithAvailability[] = (slots || []).map(
			(slot: MealSlot) => ({
				...slot,
				remaining_capacity: slot.max_capacity - slot.current_occupancy,
				is_full: slot.current_occupancy >= slot.max_capacity,
				occupancy_percentage: Math.round((slot.current_occupancy / slot.max_capacity) * 100),
			})
		);

		return {
			success: true,
			data: slotsWithAvailability,
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
 * FR-2.1.5: Get menu items available for a specific slot
 * FR-2.1.13: Filter menu items based on search text (allergies, preferences)
 */
export const getSlotMenuItems = async (
	slotId: number,
	searchText?: string,
	category?: string,
	isVegetarian?: boolean
): Promise<ServiceResponse<SlotMenuItem[]>> => {
	try {
		// First verify the slot exists and is active
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slotId)
			.eq("is_active", true)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found or is not active",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Get menu items mapped to this slot
		let query = service_client
			.from("slot_menu_mapping")
			.select(`
				*,
				menu_items (*)
			`)
			.eq("slot_id", slotId)
			.eq("is_available", true);

		const { data: mappings, error: mappingError } = await query;

		if (mappingError) {
			return {
				success: false,
				error: mappingError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		let menuItems: SlotMenuItem[] = (mappings || [])
			.filter((m: { menu_items: MenuItem | null }) => m.menu_items !== null)
			.map(
				(mapping: {
					menu_items: MenuItem;
					available_quantity: number;
					reserved_quantity: number;
					is_available: boolean;
				}) => ({
					...mapping.menu_items,
					available_quantity: mapping.available_quantity - mapping.reserved_quantity,
					reserved_quantity: mapping.reserved_quantity,
					is_slot_available:
						mapping.is_available && mapping.available_quantity > mapping.reserved_quantity,
				})
			);

		// Apply filters
		if (searchText) {
			const searchLower = searchText.toLowerCase();
			menuItems = menuItems.filter(
				(item) =>
					item.item_name.toLowerCase().includes(searchLower) ||
					(item.description && item.description.toLowerCase().includes(searchLower))
			);
		}

		if (category) {
			menuItems = menuItems.filter((item) => item.category === category);
		}

		if (isVegetarian !== undefined) {
			menuItems = menuItems.filter((item) => item.is_vegetarian === isVegetarian);
		}

		// Filter out unavailable items
		menuItems = menuItems.filter((item) => item.is_available && item.is_slot_available);

		return {
			success: true,
			data: menuItems,
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
 * FR-2.1.2, FR-2.1.3, FR-2.1.4, FR-2.1.6, FR-2.1.11, FR-2.1.12: Create a new booking
 */
export const createBooking = async (
	token: string,
	userId: string,
	bookingData: CreateBookingRequest
): Promise<ServiceResponse<BookingConfirmation>> => {
	try {
		const { slot_id, group_size, menu_items, group_member_ids, total_amount } = bookingData;

		// Validate group members count matches group size
		const expectedMembers = group_size - 1; // Primary user + other members
		const providedMembers = group_member_ids?.length || 0;

		if (providedMembers > expectedMembers) {
			return {
				success: false,
				error: `Group member count exceeds group size. Expected max ${expectedMembers} additional members.`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		const auth_supa = getAuthenticatedClient(token);

		// Check user restrictions
		const { data: restrictions, error: restrictionError } = await service_client
			.from("user_restrictions")
			.select("*")
			.eq("user_id", userId)
			.eq("is_active", true)
			.single();

		if (restrictions && !restrictionError) {
			return {
				success: false,
				error: `Your account has an active restriction: ${restrictions.reason}`,
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// FR-2.1.11: Check slot capacity
		const { data: slot, error: slotError } = await auth_supa
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slot_id)
			.eq("is_active", true)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found or is not active",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const remainingCapacity = slot.max_capacity - slot.current_occupancy;
		if (remainingCapacity < group_size) {
			return {
				success: false,
				error: `Insufficient capacity. Only ${remainingCapacity} spots available.`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Validate and calculate menu item prices
		const menuItemIds = menu_items.map((item) => item.menu_item_id);
		const { data: menuItemsData, error: menuError } = await auth_supa
			.from("menu_items")
			.select("*")
			.in("menu_item_id", menuItemIds)
			.eq("is_available", true);

		if (menuError || !menuItemsData || menuItemsData.length !== menuItemIds.length) {
			return {
				success: false,
				error: "One or more menu items are not available",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check slot menu availability
		const { data: slotMenuMappings, error: mappingError } = await auth_supa
			.from("slot_menu_mapping")
			.select("*")
			.eq("slot_id", slot_id)
			.in("menu_item_id", menuItemIds);

		if (mappingError) {
			return {
				success: false,
				error: "Error checking menu availability",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Verify quantities are available
		for (const item of menu_items) {
			const mapping = slotMenuMappings?.find((m) => m.menu_item_id === item.menu_item_id);
			if (!mapping) {
				return {
					success: false,
					error: `Menu item ${item.menu_item_id} is not available for this slot`,
					statusCode: STATUS.BADREQUEST,
				};
			}
			const availableQty = mapping.available_quantity - mapping.reserved_quantity;
			if (availableQty < item.quantity) {
				return {
					success: false,
					error: `Insufficient quantity for menu item ${item.menu_item_id}. Available: ${availableQty}`,
					statusCode: STATUS.BADREQUEST,
				};
			}
		}

		// Calculate total amount
		let totalAmount = 0;
		const menuItemPriceMap = new Map<number, number>();
		for (const item of menuItemsData) {
			menuItemPriceMap.set(item.menu_item_id, Number(item.price));
		}

		for (const item of menu_items) {
			const price = menuItemPriceMap.get(item.menu_item_id) || 0;
			totalAmount += price * item.quantity;
		}

		if (Math.round(totalAmount * 100) !== Math.round(total_amount * 100)) {
			return {
				success: false,
				error: "Invalid total Amount",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Generate booking reference
		const bookingReference = generateBookingReference();

		// Calculate payment deadline
		const paymentDeadline = calculatePaymentDeadline(slot.slot_date, slot.payment_window_end);

		// FR-2.1.4, FR-2.1.12: Create booking (confirmed without immediate payment)
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.insert({
				booking_reference: bookingReference,
				slot_id: slot_id,
				primary_user_id: userId,
				is_group_booking: group_size > 1,
				group_size: group_size,
				booking_status: "pending_payment",
				total_amount: totalAmount,
				payment_deadline: paymentDeadline,
			})
			.select()
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: bookingError?.message || "Failed to create booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Insert booking menu items
		const bookingMenuItems = menu_items.map((item) => ({
			booking_id: booking.booking_id,
			menu_item_id: item.menu_item_id,
			user_id: userId,
			quantity: item.quantity,
			unit_price: menuItemPriceMap.get(item.menu_item_id) || 0,
			subtotal: (menuItemPriceMap.get(item.menu_item_id) || 0) * item.quantity,
		}));

		const { error: menuInsertError } = await auth_supa
			.from("booking_menu_items")
			.insert(bookingMenuItems);

		if (menuInsertError) {
			// Rollback booking
			await service_client.from("bookings").delete().eq("booking_id", booking.booking_id);
			return {
				success: false,
				error: "Failed to add menu items to booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Add primary user as group member
		const { error: memberError } = await auth_supa.from("booking_group_members").insert({
			booking_id: booking.booking_id,
			user_id: userId,
		});

		if (memberError) {
			console.error("Failed to add primary user as group member:", memberError);
		}

		// Add additional group members if provided
		if (group_member_ids && group_member_ids.length > 0) {
			const groupMemberInserts = group_member_ids.map((memberId) => ({
				booking_id: booking.booking_id,
				user_id: memberId,
			}));

			const { error: groupMemberError } = await auth_supa
				.from("booking_group_members")
				.insert(groupMemberInserts);

			if (groupMemberError) {
				console.error("Failed to add group members:", groupMemberError);
			}
		}

		// FR-2.1.8: Update slot capacity
		const currentOccupance = slot.current_occupancy + group_size;
		const { error: updateError } = await auth_supa
			.from("meal_slots")
			.update({
				current_occupancy: currentOccupance,
				is_active: !(currentOccupance >= slot.max_capacity),
			})
			.eq("slot_id", slot_id);

		if (updateError) {
			console.error("Failed to update slot occupancy:", updateError);
		}

		// Update reserved quantities in slot_menu_mapping
		for (const item of menu_items) {
			const mapping = slotMenuMappings?.find((m) => m.menu_item_id === item.menu_item_id);
			let reserved_quantity_updated: number, leftover_quantity_updated: number;
			if (mapping) {
				reserved_quantity_updated = mapping.reserved_quantity + item.quantity;
				leftover_quantity_updated = mapping.available_quantity - reserved_quantity_updated;
				await auth_supa
					.from("slot_menu_mapping")
					.update({
						reserved_quantity: reserved_quantity_updated,
						leftover_quantity: leftover_quantity_updated,
						is_available: !(leftover_quantity_updated <= 0),
					})
					.eq("mapping_id", mapping.mapping_id);
			}
		}

		return {
			success: true,
			data: {
				booking_id: booking.booking_id,
				booking_reference: booking.booking_reference,
				slot_details: slot,
				total_amount: totalAmount,
				payment_deadline: paymentDeadline,
				group_size: group_size,
				is_group_booking: group_size > 1,
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
 * FR-2.1.7: Update an existing booking
 * Supports adding/removing menu items and group members
 */
export const updateBooking = async (
	userId: string,
	bookingId: number,
	updateData: UpdateBookingRequest,
	token: string
): Promise<ServiceResponse<BookingResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get existing booking with all related data
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_menu_items (*),
				booking_group_members (*)
			`)
			.eq("booking_id", bookingId)
			.eq("primary_user_id", userId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found or you don't have permission to modify it",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if booking can be modified
		if (booking.booking_status === "cancelled" || booking.booking_status === "completed") {
			return {
				success: false,
				error: "Cannot modify a cancelled or completed booking",
				statusCode: STATUS.BADREQUEST,
			};
		}

		const slot = booking.meal_slots;
		let totalAmountChange = 0;
		let capacityChange = 0;

		// ============================================
		// Handle menu items removal
		// ============================================
		if (updateData.menu_items_remove && updateData.menu_items_remove.length > 0) {
			const currentMenuItems: BookingMenuItem[] = booking.booking_menu_items;

			// Calculate how many items will remain after removal
			let remainingItemsCount = 0;
			for (const currentItem of currentMenuItems) {
				const removeItem = updateData.menu_items_remove.find(
					(r) => r.menu_item_id === currentItem.menu_item_id
				);
				if (removeItem) {
					const remainingQty = currentItem.quantity - removeItem.quantity;
					if (remainingQty > 0) {
						remainingItemsCount += remainingQty;
					}
				} else {
					remainingItemsCount += currentItem.quantity;
				}
			}

			// Ensure at least one food item remains
			if (remainingItemsCount <= 0) {
				return {
					success: false,
					error:
						"Cannot remove all menu items. At least one food item must exist for a valid booking.",
					statusCode: STATUS.BADREQUEST,
				};
			}

			// Process each item to remove
			for (const removeItem of updateData.menu_items_remove) {
				const existingItem = currentMenuItems.find(
					(item) => item.menu_item_id === removeItem.menu_item_id
				);

				if (!existingItem) {
					return {
						success: false,
						error: `Menu item ${removeItem.menu_item_id} is not in this booking`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				if (removeItem.quantity > existingItem.quantity) {
					return {
						success: false,
						error: `Cannot remove ${removeItem.quantity} of menu item ${removeItem.menu_item_id}. Only ${existingItem.quantity} in booking.`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				const newQuantity = existingItem.quantity - removeItem.quantity;
				const pricePerUnit = Number(existingItem.unit_price);
				const amountToSubtract = pricePerUnit * removeItem.quantity;
				totalAmountChange -= amountToSubtract;

				if (newQuantity === 0) {
					// Remove the item entirely
					await auth_supa
						.from("booking_menu_items")
						.delete()
						.eq("booking_id", bookingId)
						.eq("menu_item_id", removeItem.menu_item_id)
						.eq("user_id", existingItem.user_id);
				} else {
					// Update the quantity
					await auth_supa
						.from("booking_menu_items")
						.update({
							quantity: newQuantity,
							subtotal: pricePerUnit * newQuantity,
						})
						.eq("booking_id", bookingId)
						.eq("menu_item_id", removeItem.menu_item_id)
						.eq("user_id", existingItem.user_id);
				}

				// Restore reserved quantity in slot_menu_mapping
				const { data: mapping } = await auth_supa
					.from("slot_menu_mapping")
					.select("*")
					.eq("slot_id", slot.slot_id)
					.eq("menu_item_id", removeItem.menu_item_id)
					.single();

				if (mapping) {
					const newReservedQty = Math.max(0, mapping.reserved_quantity - removeItem.quantity);
					const newLeftoverQty = mapping.available_quantity - newReservedQty;
					await auth_supa
						.from("slot_menu_mapping")
						.update({
							reserved_quantity: newReservedQty,
							leftover_quantity: newLeftoverQty,
							is_available: newLeftoverQty > 0,
						})
						.eq("mapping_id", mapping.mapping_id);
				}
			}
		}

		// ============================================
		// Handle menu items addition
		// ============================================
		if (updateData.menu_items_add && updateData.menu_items_add.length > 0) {
			// Get menu item details for pricing
			const menuItemIds = updateData.menu_items_add.map((item) => item.menu_item_id);
			const { data: menuItemsData, error: menuError } = await auth_supa
				.from("menu_items")
				.select("*")
				.in("menu_item_id", menuItemIds)
				.eq("is_available", true);

			if (menuError || !menuItemsData || menuItemsData.length !== menuItemIds.length) {
				return {
					success: false,
					error: "One or more menu items are not available",
					statusCode: STATUS.BADREQUEST,
				};
			}

			// Check slot menu availability
			const { data: slotMenuMappings, error: mappingError } = await auth_supa
				.from("slot_menu_mapping")
				.select("*")
				.eq("slot_id", slot.slot_id)
				.in("menu_item_id", menuItemIds);

			if (mappingError) {
				return {
					success: false,
					error: "Error checking menu availability",
					statusCode: STATUS.SERVERERROR,
				};
			}

			// Verify quantities are available and prepare price map
			const menuItemPriceMap = new Map<number, number>();
			for (const item of menuItemsData) {
				menuItemPriceMap.set(item.menu_item_id, Number(item.price));
			}

			// Get current booking menu items to check if we need to update or insert
			const { data: currentBookingItems } = await auth_supa
				.from("booking_menu_items")
				.select("*")
				.eq("booking_id", bookingId);

			for (const addItem of updateData.menu_items_add) {
				const mapping = slotMenuMappings?.find((m) => m.menu_item_id === addItem.menu_item_id);
				if (!mapping) {
					return {
						success: false,
						error: `Menu item ${addItem.menu_item_id} is not available for this slot`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				const availableQty = mapping.available_quantity - mapping.reserved_quantity;
				if (availableQty < addItem.quantity) {
					return {
						success: false,
						error: `Insufficient quantity for menu item ${addItem.menu_item_id}. Available: ${availableQty}`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				const price = menuItemPriceMap.get(addItem.menu_item_id) || 0;
				const amountToAdd = price * addItem.quantity;
				totalAmountChange += amountToAdd;

				// Check if this item already exists in the booking for this user
				const existingItem = currentBookingItems?.find(
					(item) => item.menu_item_id === addItem.menu_item_id && item.user_id === userId
				);

				if (existingItem) {
					// Update existing item
					const newQuantity = existingItem.quantity + addItem.quantity;
					await auth_supa
						.from("booking_menu_items")
						.update({
							quantity: newQuantity,
							subtotal: price * newQuantity,
						})
						.eq("id", existingItem.id);
				} else {
					// Insert new item
					await auth_supa.from("booking_menu_items").insert({
						booking_id: bookingId,
						menu_item_id: addItem.menu_item_id,
						user_id: userId,
						quantity: addItem.quantity,
						unit_price: price,
						subtotal: amountToAdd,
					});
				}

				// Update reserved quantity in slot_menu_mapping
				const newReservedQty = mapping.reserved_quantity + addItem.quantity;
				const newLeftoverQty = mapping.available_quantity - newReservedQty;
				await auth_supa
					.from("slot_menu_mapping")
					.update({
						reserved_quantity: newReservedQty,
						leftover_quantity: newLeftoverQty,
						is_available: newLeftoverQty > 0,
					})
					.eq("mapping_id", mapping.mapping_id);
			}
		}

		// ============================================
		// Handle group members removal
		// ============================================
		if (updateData.group_member_ids_remove && updateData.group_member_ids_remove.length > 0) {
			const currentMembers: BookingGroupMember[] = booking.booking_group_members;

			for (const memberIdToRemove of updateData.group_member_ids_remove) {
				// Cannot remove primary user
				if (memberIdToRemove === userId) {
					return {
						success: false,
						error: "Cannot remove the primary booking holder. Cancel the booking instead.",
						statusCode: STATUS.BADREQUEST,
					};
				}

				// Check if member exists in the booking
				const memberExists = currentMembers.some((m) => m.user_id === memberIdToRemove);
				if (!memberExists) {
					return {
						success: false,
						error: `User ${memberIdToRemove} is not a member of this booking`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				// Get member's menu items to calculate refund
				const { data: memberMenuItems } = await auth_supa
					.from("booking_menu_items")
					.select("*")
					.eq("booking_id", bookingId)
					.eq("user_id", memberIdToRemove);

				if (memberMenuItems && memberMenuItems.length > 0) {
					// Calculate amount to subtract
					const memberTotal = memberMenuItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
					totalAmountChange -= memberTotal;

					// Restore reserved quantities for member's items
					for (const item of memberMenuItems) {
						const { data: mapping } = await auth_supa
							.from("slot_menu_mapping")
							.select("*")
							.eq("slot_id", slot.slot_id)
							.eq("menu_item_id", item.menu_item_id)
							.single();

						if (mapping) {
							const newReservedQty = Math.max(0, mapping.reserved_quantity - item.quantity);
							const newLeftoverQty = mapping.available_quantity - newReservedQty;
							await auth_supa
								.from("slot_menu_mapping")
								.update({
									reserved_quantity: newReservedQty,
									leftover_quantity: newLeftoverQty,
									is_available: newLeftoverQty > 0,
								})
								.eq("mapping_id", mapping.mapping_id);
						}
					}

					// Delete member's menu items
					await auth_supa
						.from("booking_menu_items")
						.delete()
						.eq("booking_id", bookingId)
						.eq("user_id", memberIdToRemove);
				}

				// Remove member from booking
				await auth_supa
					.from("booking_group_members")
					.delete()
					.eq("booking_id", bookingId)
					.eq("user_id", memberIdToRemove);

				capacityChange -= 1;
			}
		}

		// ============================================
		// Handle group members addition
		// ============================================
		if (updateData.group_member_ids_add && updateData.group_member_ids_add.length > 0) {
			const currentMembers: BookingGroupMember[] = booking.booking_group_members;
			const currentMemberCount = currentMembers.length;
			const newMemberCount = updateData.group_member_ids_add.length;

			// Check group size limit (max 6)
			if (currentMemberCount + newMemberCount > 6) {
				return {
					success: false,
					error: `Cannot add ${newMemberCount} members. Maximum group size is 6, current size is ${currentMemberCount}.`,
					statusCode: STATUS.BADREQUEST,
				};
			}

			// Check slot capacity
			const requiredCapacity = newMemberCount;
			const availableCapacity = slot.max_capacity - slot.current_occupancy;
			if (requiredCapacity > availableCapacity) {
				return {
					success: false,
					error: `Insufficient slot capacity. Only ${availableCapacity} spots available.`,
					statusCode: STATUS.BADREQUEST,
				};
			}

			for (const newMemberId of updateData.group_member_ids_add) {
				// Check if member already exists
				const memberExists = currentMembers.some((m) => m.user_id === newMemberId);
				if (memberExists) {
					return {
						success: false,
						error: `User ${newMemberId} is already a member of this booking`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				// Verify the user exists
				const { data: userExists, error: userError } = await auth_supa
					.from("users")
					.select("id")
					.eq("id", newMemberId)
					.single();

				if (userError || !userExists) {
					return {
						success: false,
						error: `User ${newMemberId} does not exist`,
						statusCode: STATUS.BADREQUEST,
					};
				}

				// Add member to booking
				await auth_supa.from("booking_group_members").insert({
					booking_id: bookingId,
					user_id: newMemberId,
				});

				capacityChange += 1;
			}
		}

		// ============================================
		// Update booking totals and slot capacity
		// ============================================
		const newTotalAmount = Number(booking.total_amount) + totalAmountChange;
		const newGroupSize = booking.group_size + capacityChange;

		// Update booking
		await auth_supa
			.from("bookings")
			.update({
				total_amount: newTotalAmount,
				group_size: newGroupSize,
				is_group_booking: newGroupSize > 1,
			})
			.eq("booking_id", bookingId);

		// FR-2.1.8: Update slot capacity if group size changed
		if (capacityChange !== 0) {
			const newOccupancy = slot.current_occupancy + capacityChange;
			await auth_supa
				.from("meal_slots")
				.update({
					current_occupancy: newOccupancy,
					is_active: newOccupancy < slot.max_capacity,
				})
				.eq("slot_id", slot.slot_id);
		}

		// ============================================
		// Fetch and return updated booking
		// ============================================
		const { data: updatedBooking, error: fetchError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_menu_items (*, menu_items (*)),
				booking_group_members (*)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (fetchError || !updatedBooking) {
			return {
				success: false,
				error: "Failed to fetch updated booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const response: BookingResponse = {
			...updatedBooking,
			slot: updatedBooking.meal_slots,
			menu_items: updatedBooking.booking_menu_items.map(
				(bmi: BookingMenuItem & { menu_items: MenuItem }) => ({
					...bmi,
					item_details: bmi.menu_items,
				})
			),
			group_members: updatedBooking.booking_group_members,
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
 * FR-2.1.7, FR-2.1.8: Cancel a booking
 */
export const cancelBooking = async (
	token: string,
	userId: string,
	bookingId: number,
	reason?: string
): Promise<ServiceResponse<{ message: string }>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);
		// Get booking with related data
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_menu_items (*)
			`)
			.eq("booking_id", bookingId)
			.eq("primary_user_id", userId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found or you don't have permission to cancel it",
				statusCode: STATUS.NOTFOUND,
			};
		}

		if (booking.booking_status === "cancelled") {
			return {
				success: false,
				error: "Booking is already cancelled",
				statusCode: STATUS.BADREQUEST,
			};
		}

		if (booking.booking_status === "completed") {
			return {
				success: false,
				error: "Cannot cancel a completed booking",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Insert cancellation reason as feedback if token exists and reason is provided
		//LOOK INTO THIS LATER
		if (reason) {
			const { error: feedbackError } = await auth_supa.from("user_feedback").insert({
				user_id: userId,
				booking_id: bookingId,
				feedback_text: `Cancellation reason: ${reason}`,
			});

			if (feedbackError) {
				console.error("Failed to insert cancellation feedback:", feedbackError);
			}
		}

		// Update booking status
		const { error: updateError } = await auth_supa
			.from("bookings")
			.update({ booking_status: "cancelled" })
			.eq("booking_id", bookingId);

		if (updateError) {
			return {
				success: false,
				error: "Failed to cancel booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// FR-2.1.8: Update slot capacity (decrease)
		const slot = booking.meal_slots;
		await auth_supa
			.from("meal_slots")
			.update({
				current_occupancy: Math.max(0, slot.current_occupancy - booking.group_size),
				is_active: true,
			})
			.eq("slot_id", slot.slot_id);

		// FR-2.1.8: Restore reserved quantities
		for (const item of booking.booking_menu_items) {
			const { data: mapping } = await auth_supa
				.from("slot_menu_mapping")
				.select("*")
				.eq("slot_id", slot.slot_id)
				.eq("menu_item_id", item.menu_item_id)
				.single();

			if (mapping) {
				await auth_supa
					.from("slot_menu_mapping")
					.update({
						reserved_quantity: Math.max(0, mapping.reserved_quantity - item.quantity),
						leftover_quantity: mapping.leftover_quantity + item.quantity,
						is_available: true,
					})
					.eq("mapping_id", mapping.mapping_id);
			}
		}

		return {
			success: true,
			data: { message: "Booking cancelled successfully" },
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
 * Get user's bookings (where user is primary user or a group member)
 */
export const getUserBookings = async (
	token: string,
	userId: string,
	status?: string
): Promise<ServiceResponse<BookingResponse[]>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// 1. Get IDs of bookings where the user is a group member
		const { data: memberBookings, error: memberError } = await auth_supa
			.from("booking_group_members")
			.select("booking_id")
			.eq("user_id", userId);

		if (memberError) throw new Error(memberError.message);

		const memberBookingIds = memberBookings?.map((b) => b.booking_id) || [];

		// 2. Build the main query on the bookings table
		let query = auth_supa.from("bookings").select(`
                *,
                meal_slots!inner (*),
                booking_menu_items (*, menu_items (*)),
                booking_group_members (*)
            `);

		// 3. Apply the OR logic using the IDs we found
		// Logic: primary_user_id is user OR booking_id is in the list of member bookings
		if (memberBookingIds.length > 0) {
			query = query.or(
				`primary_user_id.eq.${userId},booking_id.in.(${memberBookingIds.join(",")})`
			);
		} else {
			query = query.eq("primary_user_id", userId);
		}

		if (status) {
			query = query.eq("booking_status", status);
		}

		const { data: bookings, error } = await query.order("created_at", { ascending: false });

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		const response: BookingResponse[] = (bookings || []).map((booking) => ({
			...booking,
			slot: booking.meal_slots,
			menu_items: (booking.booking_menu_items || []).map((bmi: any) => ({
				...bmi,
				item_details: bmi.menu_items,
			})),
			group_members: booking.booking_group_members,
		}));

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
 * Get booking by ID
 */
export const getBookingById = async (
	token: string,
	userId: string,
	bookingId: number
): Promise<ServiceResponse<BookingResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);
		const { data: booking, error } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_menu_items (*, menu_items (*)),
				booking_group_members (*)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (error || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user has access to this booking
		const isOwner = booking.primary_user_id === userId;
		const isMember = booking.booking_group_members.some(
			(member: BookingGroupMember) => member.user_id === userId
		);

		if (!isOwner && !isMember) {
			return {
				success: false,
				error: "You don't have permission to view this booking",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		const response: BookingResponse = {
			...booking,
			slot: booking.meal_slots,
			menu_items: booking.booking_menu_items.map(
				(bmi: BookingMenuItem & { menu_items: MenuItem }) => ({
					...bmi,
					item_details: bmi.menu_items,
				})
			),
			group_members: booking.booking_group_members,
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
 * FR-2.1.9, FR-2.1.10: Get slot recommendations based on demand analysis
 */
export const getSlotRecommendations = async (
	date: string,
	groupSize: number = 1
): Promise<ServiceResponse<SlotRecommendation[]>> => {
	try {
		// Get all active slots for the date
		const { data: slots, error: slotsError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_date", date)
			.eq("is_active", true)
			.order("start_time", { ascending: true });

		if (slotsError) {
			return {
				success: false,
				error: slotsError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		if (!slots || slots.length === 0) {
			return {
				success: true,
				data: [],
				statusCode: STATUS.SUCCESS,
			};
		}

		// Get historical booking data for demand prediction
		// Calculate average bookings for similar slots in past weeks (IST)
		const pastDates: string[] = [];
		for (let i = 1; i <= 4; i++) {
			const pastDate = new Date(date);
			pastDate.setDate(pastDate.getDate() - i * 7);
			pastDates.push(formatDateOnly(pastDate));
		}

		const recommendations: SlotRecommendation[] = [];

		for (const slot of slots) {
			const remainingCapacity = slot.max_capacity - slot.current_occupancy;

			// Skip if not enough capacity
			if (remainingCapacity < groupSize) {
				continue;
			}

			// Get historical data for similar slots
			const { data: historicalData } = await service_client
				.from("bookings")
				.select("group_size")
				.eq("booking_status", "completed")
				.in("slot_id", [slot.slot_id]);

			// Calculate predicted demand
			const occupancyPercentage = (slot.current_occupancy / slot.max_capacity) * 100;
			let predictedDemand: "low" | "medium" | "high";
			let recommendationReason: string;

			if (occupancyPercentage < 30) {
				predictedDemand = "low";
				recommendationReason = "Low traffic expected - great time to visit!";
			} else if (occupancyPercentage < 70) {
				predictedDemand = "medium";
				recommendationReason = "Moderate traffic expected";
			} else {
				predictedDemand = "high";
				recommendationReason = "High traffic expected - consider earlier or later slots";
			}

			const slotWithAvailability: MealSlotWithAvailability = {
				...slot,
				remaining_capacity: remainingCapacity,
				is_full: remainingCapacity <= 0,
				occupancy_percentage: Math.round(occupancyPercentage),
			};

			recommendations.push({
				slot: slotWithAvailability,
				recommendation_reason: recommendationReason,
				predicted_demand: predictedDemand,
			});
		}

		// Sort by demand (low first) to recommend less crowded slots
		recommendations.sort((a, b) => {
			const demandOrder = { low: 0, medium: 1, high: 2 };
			return demandOrder[a.predicted_demand] - demandOrder[b.predicted_demand];
		});

		return {
			success: true,
			data: recommendations,
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
 * FR-2.1.9: Analyze demand for slots
 */
export const analyzeDemand = async (date: string): Promise<ServiceResponse<DemandAnalysis[]>> => {
	try {
		const { data: slots, error: slotsError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_date", date)
			.eq("is_active", true);

		if (slotsError) {
			return {
				success: false,
				error: slotsError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		const demandAnalysis: DemandAnalysis[] = [];

		for (const slot of slots || []) {
			// Get current bookings for this slot
			const { data: bookings, error: bookingsError } = await service_client
				.from("bookings")
				.select("group_size")
				.eq("slot_id", slot.slot_id)
				.in("booking_status", ["pending_payment", "confirmed"]);

			const currentBookings = bookings?.reduce((sum, b) => sum + b.group_size, 0) || 0;

			// Get historical average (simplified - using current occupancy as proxy)
			const historicalAverage = slot.max_capacity * 0.6; // Assume 60% average

			// Calculate demand level
			const occupancyRate = slot.current_occupancy / slot.max_capacity;
			let demandLevel: "low" | "medium" | "high";

			if (occupancyRate < 0.4) {
				demandLevel = "low";
			} else if (occupancyRate < 0.75) {
				demandLevel = "medium";
			} else {
				demandLevel = "high";
			}

			// Simple prediction based on current trend
			const predictedDemand = Math.min(slot.max_capacity, slot.current_occupancy * 1.2);

			demandAnalysis.push({
				slot_id: slot.slot_id,
				slot_name: slot.slot_name,
				slot_date: slot.slot_date,
				current_bookings: currentBookings,
				predicted_demand: Math.round(predictedDemand),
				demand_level: demandLevel,
				historical_average: Math.round(historicalAverage),
			});
		}

		return {
			success: true,
			data: demandAnalysis,
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
