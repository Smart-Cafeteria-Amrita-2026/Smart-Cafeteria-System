export const API_ROUTES = {
	//Backend routes
	AUTH: {
		REGISTER: "/auth/user/register",
		LOGIN: "/auth/user/login",
		LOGOUT: "/auth/user/logout",
		SESSION: "/auth/user/session",
		USER_BY_ID: "api/auth/user", // GET /api/auth/user/:userId
	},
	BOOKINGS: {
		SLOTS: "/api/bookings/slots",
		CREATE: "/api/bookings",
		SEARCH_USERS: "/api/bookings/users/search",
		MY_BOOKINGS: "/api/bookings/my-bookings",
		BY_ID: "/api/bookings", // GET/PUT/DELETE /api/bookings/:bookingId
		PAYMENTS: "/api/bookings/payments",
	},
	WALLET: {
		TRANSACTIONS: "/api/payments/personal-wallet/transactions",
	},
};
