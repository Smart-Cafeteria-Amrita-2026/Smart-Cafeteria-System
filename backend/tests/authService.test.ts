import {
	createUser,
	signIn,
	logOut,
	requestPasswordReset,
	updateUserPassword,
} from "../src/services/authService";

import { service_client, public_client, getAuthenticatedClient } from "../src/config/supabase";

import { STATUS } from "../src/interfaces/status.types";

// Mock the supabase module
jest.mock("../src/config/supabase");

// Needed for requestPasswordReset
process.env.FRONTEND_URL = "http://localhost:3000";

describe("AuthService Unit Tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// =====================
	// ✅ VALID TEST CASES
	// =====================

	test("VALID 1: createUser succeeds", async () => {
		(service_client.auth.admin.createUser as jest.Mock).mockResolvedValue({
			data: { user: { id: "123" } },
			error: null,
		});

		(service_client.from as jest.Mock).mockReturnValue({
			insert: jest.fn().mockResolvedValue({ error: null }),
		});

		const res = await createUser({
			email: "test@mail.com",
			password: "pass",
			role: "student",
			first_name: "Test",
			last_name: "User",
			college_id: "C001",
			mobile: "9999999999",
			department: "CSE",
		});

		expect(res.success).toBe(true);
		expect(res.statusCode).toBe(STATUS.CREATED);
	});

	test("VALID 2: signIn succeeds", async () => {
		(public_client.auth.signInWithPassword as jest.Mock).mockResolvedValue({
			data: {
				user: {
					user_metadata: { role: "student" },
					app_metadata: { email: "test@mail.com" },
				},
				session: {
					access_token: "access",
					refresh_token: "refresh",
				},
			},
			error: null,
		});

		const res = await signIn({ email: "test@mail.com", password: "pass" });

		expect(res.success).toBe(true);
		expect(res.data?.accessToken).toBe("access");
	});

	test("VALID 3: logOut succeeds", async () => {
		(getAuthenticatedClient as jest.Mock).mockReturnValue({
			auth: {
				signOut: jest.fn().mockResolvedValue({ error: null }),
			},
		});

		const res = await logOut("token");

		expect(res.success).toBe(true);
		expect(res.statusCode).toBe(STATUS.ACCEPTED);
	});

	test("VALID 4: requestPasswordReset succeeds", async () => {
		(service_client.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
			error: null,
		});

		await expect(requestPasswordReset("test@mail.com")).resolves.not.toThrow();
	});

	test("VALID 5: updateUserPassword succeeds", async () => {
		(service_client.auth.getUser as jest.Mock).mockResolvedValue({
			data: { user: { id: "123" } },
			error: null,
		});

		(service_client.auth.admin.updateUserById as jest.Mock).mockResolvedValue({
			error: null,
		});

		await expect(updateUserPassword("token", "newPass")).resolves.not.toThrow();
	});

	// =====================
	// ❌ INVALID TEST CASES
	// =====================

	test("INVALID 1: createUser fails on auth error", async () => {
		(service_client.auth.admin.createUser as jest.Mock).mockResolvedValue({
			data: null,
			error: { message: "Email exists" },
		});

		const res = await createUser({} as any);

		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(STATUS.BADREQUEST);
	});

	test("INVALID 2: createUser rolls back if profile insert fails", async () => {
		(service_client.auth.admin.createUser as jest.Mock).mockResolvedValue({
			data: { user: { id: "123" } },
			error: null,
		});

		(service_client.from as jest.Mock).mockReturnValue({
			insert: jest.fn().mockResolvedValue({
				error: { message: "DB error" },
			}),
		});

		const res = await createUser({} as any);

		expect(public_client.auth.admin.deleteUser).toHaveBeenCalled();
		expect(res.success).toBe(false);
	});

	test("INVALID 3: signIn fails with invalid credentials", async () => {
		(public_client.auth.signInWithPassword as jest.Mock).mockResolvedValue({
			data: null,
			error: { message: "Invalid credentials" },
		});

		const res = await signIn({ email: "x@y.com", password: "wrong" });

		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(STATUS.BADREQUEST);
	});

	test("INVALID 4: logOut fails when signOut errors", async () => {
		(getAuthenticatedClient as jest.Mock).mockReturnValue({
			auth: {
				signOut: jest.fn().mockResolvedValue({
					error: { message: "Logout failed" },
				}),
			},
		});

		const res = await logOut("token");

		expect(res.success).toBe(false);
	});

	test("INVALID 5: updateUserPassword fails for invalid token", async () => {
		(service_client.auth.getUser as jest.Mock).mockResolvedValue({
			data: { user: null },
			error: { message: "Invalid token" },
		});

		await expect(updateUserPassword("badToken", "pass")).rejects.toThrow(
			"Invalid or expired session token"
		);
	});
});
