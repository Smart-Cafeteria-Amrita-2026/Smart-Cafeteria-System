const mockAuthResponse = (data = {}, error = null) => ({
  data,
  error,
});

const mockUser = {
  id: 'test-user-id',
  email: 'test@gmail.com',
  user_metadata: {
    role: 'user',
    college_id: 'CB.EN.U4CSE21000',
    first_name: 'John',
    last_name: 'Doe'
  },
  app_metadata: {
    email: 'test@gmail.com'
  }
};

const mockAuthAdmin = {
  createUser: jest.fn(() => mockAuthResponse({ user: mockUser })),
  deleteUser: jest.fn(() => mockAuthResponse()),
  updateUserById: jest.fn(() => mockAuthResponse()),
};

const mockAuth = {
  signInWithPassword: jest.fn(() => mockAuthResponse({
    user: mockUser,
    session: { access_token: 'valid-token', refresh_token: 'refresh-token' }
  })),
  signOut: jest.fn(() => mockAuthResponse()),
  resetPasswordForEmail: jest.fn(() => mockAuthResponse()),
  getUser: jest.fn(() => mockAuthResponse({ user: mockUser })),
  refreshSession: jest.fn(() => mockAuthResponse({
    session: { access_token: 'new-token', refresh_token: 'new-refresh-token' },
    user: mockUser
  })),
  admin: mockAuthAdmin,
};

const mockFrom = jest.fn(() => ({
  insert: jest.fn(() => mockAuthResponse()),
  select: jest.fn(() => ({
    eq: jest.fn(() => mockAuthResponse([])),
  })),
}));

export const service_client = {
  auth: mockAuth,
  from: mockFrom,
};

export const public_client = {
  auth: mockAuth,
  from: mockFrom,
};

export const getAuthenticatedClient = jest.fn(() => ({
  auth: mockAuth,
  from: mockFrom,
}));
