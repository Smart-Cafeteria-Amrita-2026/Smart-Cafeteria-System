import { supabase } from '../config/supabase';
import { RegisterUserRequest } from '../interfaces/user.types';
import { ServiceResponse, STATUS } from '../interfaces/status.types';

export const createUser = async (validatedUser : RegisterUserRequest) : Promise<ServiceResponse> => {
    const { email, password, first_name,last_name, college_id, mobile, department } = validatedUser;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name, college_id} 
    });

    if(authError) return { success: false, error: authError.message, statusCode: STATUS.BADREQUEST };
    if (!authData.user) return { success: false, error: 'User creation failed unexpectedly', statusCode: STATUS.SERVERERROR };

    const userId = authData.user.id;
    const { error: profileError } = await supabase
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
          role: 'user',
          account_status: 'active',
          wallet_balance: 0.00
        }
      ]);

    if(profileError){
        await supabase.auth.admin.deleteUser(userId);
        return {success: false, error: profileError.message, statusCode: STATUS.SERVERERROR };
    }

    return { success: true, statusCode: STATUS.CREATED };
}