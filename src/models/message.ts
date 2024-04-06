import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String },
  time_stamp: { type: Date, default: Date.now },
  text: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

MessageSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATE_MED);
});

export const Message = mongoose.model("Message", MessageSchema);
