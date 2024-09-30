import { Document } from 'mongoose';
import { admininterface } from 'src/event/dto/interface';
import { user } from 'src/user/entities/interface';

export interface bookinginterface extends Document {
  user: user;
  event: admininterface;

  cancelledAt: { type: Date };
}
