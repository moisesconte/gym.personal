export type UserDTO = {
  id: number;
  login: string;
  name: string;
  photo_url: string;
  verified: boolean;
  role: string;
  token: string;
  refresh_token: string;
}