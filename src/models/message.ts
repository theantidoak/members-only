import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String },
  time_stamp: { type: Date, default: Date.now },
  edit_time_stamp: { type: Date, default: Date.now },
  text: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

MessageSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATETIME_SHORT);
});

MessageSchema.virtual("edit_date").get(function () {
  return DateTime.fromJSDate(this.edit_time_stamp).toLocaleString(DateTime.DATETIME_SHORT);
});

export const Message = mongoose.model("Message", MessageSchema);
