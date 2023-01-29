export type StudentDTO = {
  id: string;
  name: string;
  photo_url: string;
  birth_date: string;
  genre: string;
  phone: string;
  email: string;
  owner_id: string;
  create_at: string;
  owner: {
    login: string;
    name: string;
  };
  user: {
    id: string;
    login: string;
    name: string;
    role: string;
    verified: boolean;
  };
};
