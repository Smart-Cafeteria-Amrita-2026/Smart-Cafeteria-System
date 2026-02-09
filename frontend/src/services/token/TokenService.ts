import { apiGet, apiPost } from "@/lib/api";
import type {
	TokenApiResponse,
	TokenGenerationResponse,
	TokenWithDetails,
} from "@/src/types/token.types";

export const TokenService = {
	/** POST /api/tokens/generate — Generate a token after bill settlement */
	generateToken: (bookingId: number): Promise<TokenApiResponse<TokenGenerationResponse>> =>
		apiPost<TokenApiResponse<TokenGenerationResponse>>("api/tokens/generate", {
			booking_id: bookingId,
		}),

	/** GET /api/tokens/booking/:bookingReference — Get token by booking reference */
	getTokenByBookingReference: (
		bookingReference: string
	): Promise<TokenApiResponse<TokenWithDetails>> =>
		apiGet<TokenApiResponse<TokenWithDetails>>(`api/tokens/booking/${bookingReference}`),

	/** GET /api/tokens/:tokenId — Get full token details */
	getTokenDetails: (tokenId: number): Promise<TokenApiResponse<TokenWithDetails>> =>
		apiGet<TokenApiResponse<TokenWithDetails>>(`api/tokens/${tokenId}`),

	/**
	 * Get the SSE URL for real-time queue status updates
	 * Returns the full URL for EventSource connection
	 */
	getQueueStatusSSEUrl: (tokenId: number): string => {
		const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
		return `${baseUrl}api/tokens/queue/live?token_id=${tokenId}`;
	},
};
