import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String },
  time_stamp: { type: Date, default: Date.now },
  text: { type: String }
})

MessageSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);