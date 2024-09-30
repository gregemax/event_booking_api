import mongoose, { Schema } from 'mongoose';

export const admin_event = new mongoose.Schema({
  name: {
    type: String,

    required: [true, 'Name is required'],
    minlength: 4,
    maxlength: 50,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: (value) => value >= new Date(),
      message: 'Event date must be in the in the future',
    },
  },
  location: {
    type: String,
    required: [true, 'location is required'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },

  attendees: [String],

  createdAt: { type: Date, default: Date.now },

  number_ticket_remaining: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, 'price is required'],
    default: 0,
  },
  Booked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'booking' }],
});
