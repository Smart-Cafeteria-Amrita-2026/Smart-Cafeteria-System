import { service_client, public_client, getAuthenticatedClient } from '../config/supabase';
import { RegisterUserRequest } from '../interfaces/user.types';
import { ServiceResponse, STATUS } from '../interfaces/status.types';
import { SignInRequest, signInResponse } from '../interfaces/auth.types';

export const createUser = async (validatedUser: RegisterUserRequest): Promise<ServiceResponse<void>> => {
  const { email, password, role, first_name, last_name, college_id, mobile, department } = validatedUser;

  const { data: authData, error: authError } = await service_client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name, last_name, college_id, role }
  });

  if (authError) return { success: false, error: authError.message, statusCode: STATUS.BADREQUEST };
  if (!authData.user) return { success: false, error: 'User creation failed unexpectedly', statusCode: STATUS.SERVERERROR };

  const userId = authData.user.id;
  const { error: profileError } = await service_client
    .from('users')
    .insert([
      {
        id: userId,
        email,
        first_name,
        last_name,
        college_id,
        mobile: mobile || null,
        department: department || null,
        role: role,
        account_status: 'active',
        wallet_balance: 0.00
      }
    ]);

  if (profileError) {
    await public_client.auth.admin.deleteUser(userId);
    return { success: false, error: profileError.message, statusCode: STATUS.SERVERERROR };
  }

  return { success: true, statusCode: STATUS.CREATED };
}

export const signIn = async (validatedUser: SignInRequest): Promise<ServiceResponse<signInResponse>> => {
  const { email, password } = validatedUser;

  const { data: authData, error: authError } = await public_client.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) return { success: false, error: authError.message, statusCode: STATUS.BADREQUEST };
  if (!authData.user) return { success: false, error: 'User creation failed unexpectedly', statusCode: STATUS.SERVERERROR };


  return { success: true, statusCode: STATUS.ACCEPTED, data: { accessToken: authData.session.access_token, refreshToken: authData.session.refresh_token, role: authData.user.user_metadata.role, email: authData.user.app_metadata.email } };
}

export const logOut = async (accessToken: string): Promise<ServiceResponse<void>> => {
  try {
    const supabase = getAuthenticatedClient(accessToken);
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
    return { success: true, statusCode: STATUS.ACCEPTED };
  } catch (error: any) {
    return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
  }
}

export const requestPasswordReset = async (email: string): Promise<void> => {
    const { error } = await service_client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`, 
    });

    if (error) {
      throw new Error(error.message);
    }
}

export const updateUserPassword = async (accessToken: string, newPassword: string): Promise<void> => {

  const { data: { user }, error } = await service_client.auth.getUser(accessToken);
  if (error || !user) {
      throw new Error("Invalid or expired session token");
  }
  
  const { error: updateError } = await service_client.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

  if (updateError) {
      throw new Error(updateError.message);
    }
}