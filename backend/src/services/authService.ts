import { getAuthenticatedClient, public_client, service_client } from "../config/supabase";
import type { SignInRequest, signInResponse } from "../interfaces/auth.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import type {
	RegisterUserRequest,
	UpdateProfileRequest,
	UserProfile,
} from "../interfaces/user.types";
import { getCurrentISOStringIST } from "../utils/dateUtils";

export const createUser = async (
	validatedUser: RegisterUserRequest
): Promise<ServiceResponse<void>> => {
	const { email, password, role, first_name, last_name, college_id, mobile, department } =
		validatedUser;

	const { data: authData, error: authError } = await service_client.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: { first_name, last_name, college_id, role },
	});

	if (authError)
		return {
			success: false,
			error: authError.message,
			statusCode: STATUS.BADREQUEST,
		};
	if (!authData.user)
		return {
			success: false,
			error: "User creation failed unexpectedly",
			statusCode: STATUS.SERVERERROR,
		};

	const userId = authData.user.id;
	const { error: profileError } = await service_client.from("users").insert([
		{
			id: userId,
			email,
			first_name,
			last_name,
			college_id,
			mobile: mobile || null,
			department: department || null,
			role: role,
			account_status: "active",
			wallet_balance: 0.0,
		},
	]);

	if (profileError) {
		await public_client.auth.admin.deleteUser(userId);
		return {
			success: false,
			error: profileError.message,
			statusCode: STATUS.SERVERERROR,
		};
	}

	return { success: true, statusCode: STATUS.CREATED };
};

export const signIn = async (
	validatedUser: SignInRequest
): Promise<ServiceResponse<signInResponse>> => {
	const { email, password } = validatedUser;

	const { data: authData, error: authError } = await public_client.auth.signInWithPassword({
		email,
		password,
	});

	if (authError)
		return {
			success: false,
			error: authError.message,
			statusCode: STATUS.BADREQUEST,
		};
	if (!authData.user)
		return {
			success: false,
			error: "User creation failed unexpectedly",
			statusCode: STATUS.SERVERERROR,
		};

	return {
		success: true,
		statusCode: STATUS.ACCEPTED,
		data: {
			accessToken: authData.session.access_token,
			refreshToken: authData.session.refresh_token,
			role: authData.user.user_metadata.role,
			email: authData.user.email,
		},
	};
};

export const logOut = async (accessToken: string): Promise<ServiceResponse<void>> => {
	try {
		const supabase = getAuthenticatedClient(accessToken);
		const { error } = await supabase.auth.signOut();
		if (error)
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		return { success: true, statusCode: STATUS.ACCEPTED };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		} else {
			return {
				success: false,
				error: "Unknown Error",
				statusCode: STATUS.SERVERERROR,
			};
		}
	}
};

export const requestPasswordReset = async (email: string): Promise<void> => {
	const { error } = await service_client.auth.resetPasswordForEmail(email, {
		redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
	});

	if (error) {
		throw new Error(error.message);
	}
};

export const updateUserPassword = async (
	accessToken: string,
	newPassword: string
): Promise<void> => {
	const {
		data: { user },
		error,
	} = await service_client.auth.getUser(accessToken);
	if (error || !user) {
		throw new Error("Invalid or expired session token");
	}

	const { error: updateError } = await service_client.auth.admin.updateUserById(user.id, {
		password: newPassword,
	});

	if (updateError) {
		throw new Error(updateError.message);
	}
};

export const getUserProfile = async (userId: string): Promise<ServiceResponse<UserProfile>> => {
	const { data, error } = await service_client
		.from("users")
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, account_status, wallet_balance, created_at"
		)
		.eq("id", userId)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.NOTFOUND,
		};
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as UserProfile,
	};
};

export const updateUserProfile = async (
	userId: string,
	updateData: UpdateProfileRequest
): Promise<ServiceResponse<UserProfile>> => {
	const { data, error } = await service_client
		.from("users")
		.update({
			...updateData,
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", userId)
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, account_status, wallet_balance, created_at"
		)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Also update auth metadata if first_name or last_name changed
	if (updateData.first_name || updateData.last_name) {
		const metadataUpdate: Record<string, string> = {};
		if (updateData.first_name) metadataUpdate.first_name = updateData.first_name;
		if (updateData.last_name) metadataUpdate.last_name = updateData.last_name;

		await service_client.auth.admin.updateUserById(userId, {
			user_metadata: metadataUpdate,
		});
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as UserProfile,
	};
};

/**
 * Get basic user details by userId (for group member display)
 */
export const getUserById = async (
	userId: string
): Promise<
	ServiceResponse<{
		id: string;
		email: string;
		first_name: string;
		last_name: string;
		college_id: string;
	}>
> => {
	const { data, error } = await service_client
		.from("users")
		.select("id, email, first_name, last_name, college_id")
		.eq("id", userId)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.NOTFOUND,
		};
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as {
			id: string;
			email: string;
			first_name: string;
			last_name: string;
			college_id: string;
		},
	};
};
