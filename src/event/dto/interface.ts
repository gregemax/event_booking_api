import { Document } from 'mongoose';
import { bookinginterface } from 'src/booking/interface';

export interface admininterface extends Document {
  name: String;

  date: Date;

  location: String;

  description: String;

  attendees: [String];

  createdAt: Date;

  price: number;
  number_ticket_remaining: number;
  Booked: [bookinginterface];
}
