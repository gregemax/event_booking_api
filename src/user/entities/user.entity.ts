import mongoose from 'mongoose';
import * as bcryptjs from 'bcryptjs';

export const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [4, 'password must be at least 4 characters long'],
    select: false,
  },

  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  confirmpassword: {
    type: String,
    required: [true, 'confirm password is required'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'Passwords do not match',
    },
  },
  BookedeventID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
  ],
  avatar: String,

  token: String,
});

user.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmpassword = undefined;

  next();
});

//export const users = mongoose.model('user', user);
