import mongoose from 'mongoose';

export const booking = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin_event' },

  bookedAt: {
    type: Date,
    default: new Date(Date.now()),
  },

  cancelledAt: { type: Date },
});
