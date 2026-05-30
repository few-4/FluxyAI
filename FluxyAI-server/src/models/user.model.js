import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Registration API uses username, email, and password.
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Registration service should hash this value before saving a local user.
      required: function () {
        return !this.googleAccount;
      },
    },

    googleAccount: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);


const userModel = mongoose.model('User', userSchema);

export default userModel;
