export type UserDTO = {
  id: string;
  login: string;
  name: string;
  photo_url: string;
  verified: boolean;
  role: string;
  token: string;
  refresh_token: string;
  student_id?: string;
}