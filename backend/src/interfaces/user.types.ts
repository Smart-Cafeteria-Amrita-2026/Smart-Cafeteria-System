export interface RegisterUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name : string;
  college_id: string;
  mobile?: string;    
  department?: string;
}