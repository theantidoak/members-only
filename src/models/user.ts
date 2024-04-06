import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ["member", "admin", "user"],
    default: "user",
  }
})

export const User = mongoose.model("User", UserSchema);