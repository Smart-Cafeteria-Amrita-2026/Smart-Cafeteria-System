export const service_client = {
	auth: {
		admin: {
			createUser: jest.fn(),
			updateUserById: jest.fn(),
			deleteUser: jest.fn(),
		},
		resetPasswordForEmail: jest.fn(),
		getUser: jest.fn(),
	},
	from: jest.fn(),
};

export const public_client = {
	auth: {
		signInWithPassword: jest.fn(),
		admin: {
			deleteUser: jest.fn(),
		},
	},
};

export const getAuthenticatedClient = jest.fn(() => ({
	auth: {
		signOut: jest.fn(),
	},
}));
