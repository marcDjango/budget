// types.ts

export type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  role: string;
};

export type Session = {
  user: User;
  expires: string;
} | null;
