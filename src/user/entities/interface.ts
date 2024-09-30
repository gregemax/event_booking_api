import { Document } from 'mongoose';

export interface user extends Document {
  name: string;

  email: string;

  password: string;

  avatar?: string;

  token?: string;

  role: string;
  
  BookedeventID: [number];
  
}
