import { z } from 'zod';

const amritaEmailRegex = /^cb\.[a-zA-Z0-9._]+@cb\.(students|staff)\.amrita\.edu$/;

export const registerSchema = z.object({
  email: z.string().regex(amritaEmailRegex, "Email must be a valid Amrita ID"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character (e.g., !@#$%)"),
  first_name: z.string().min(2, "First Name is too short"),
  last_name: z.string().min(1, "Last Name is too Short"),
  college_id: z.string().min(16, "College ID is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits").optional(),
  department: z.string().optional()
});

export type RegisterUserInput = z.infer<typeof registerSchema>;