import { Request, Response } from 'express';
import { registerSchema, signInSchema } from '../validations/auth.schema';
import { createUser, signIn, logOut } from '../services/authService';
import { STATUS } from '../interfaces/status.types';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.safeParse(req.body);

    if(!validatedData.success){
        res.status(STATUS.BADREQUEST).json({error : 'Validation Error' + validatedData.error});
        return;
    }
    const result = await createUser(validatedData.data);

    if (!result.success) {
      res.status(result.statusCode).json({ success: false, error: result.error });
      return;
    }

    res.status(result.statusCode).json({success: true,
      message: 'User registered successfully',
      data: result.data
    });

  } catch (error) {
    res.status(STATUS.SERVERERROR).json({ error: 'Internal Server Error' });
  }
};

export const signInUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = signInSchema.safeParse(req.body);
    if(!validatedData.success){
        res.status(STATUS.BADREQUEST).json({error : 'Validation Error' + validatedData.error});
        return;
    }
    const result = await signIn(validatedData.data);
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!result.success) {
      res.status(result.statusCode).json({ success: false, error: result.error });
      return;
    }

    res.cookie('access_token', result.data?.accessToken, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refresh_token', result.data?.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(result.statusCode).json({success: true,
      message: 'User signed in successfully',
      data: result.data
    });

  } catch (error) {
    res.status(STATUS.SERVERERROR).json({ error: 'Internal Server Error' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  const access_token = req.cookies.access_token;

  if(access_token){
    const result = await logOut(access_token);
    if (!result.success) {
      console.warn('Supabase SignOut failed:', result.error);
    }
  }

  return res.status(200).json({ message: 'Logged out successfully' });
};