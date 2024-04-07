import mongoose from 'mongoose';
import _ from 'lodash';

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
});

UserSchema.virtual("name").get(function () {
  const firstName = _.capitalize(this.first_name);
  const lastName = this.last_name && this.last_name.length > 0 ? _.capitalize(this.last_name) : '';
  return `${firstName} ${lastName}`;
});

export const User = mongoose.model("User", UserSchema);