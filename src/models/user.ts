import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ["member", "admin", "user"],
    default: "user",
  },

})


module.exports = mongoose.model("User", UserSchema);