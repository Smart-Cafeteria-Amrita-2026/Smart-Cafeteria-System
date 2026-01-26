import { Request, Response } from 'express';
import { registerSchema} from '../validations/auth.schema';
import { createUser } from '../services/authService';
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