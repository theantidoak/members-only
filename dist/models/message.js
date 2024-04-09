"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const luxon_1 = require("luxon");
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    title: { type: String },
    time_stamp: { type: Date, default: Date.now },
    edit_time_stamp: { type: Date, default: Date.now },
    text: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
MessageSchema.virtual("date").get(function () {
    return luxon_1.DateTime.fromJSDate(this.time_stamp).toLocaleString(luxon_1.DateTime.DATE_SHORT);
});
MessageSchema.virtual("edit_date").get(function () {
    return luxon_1.DateTime.fromJSDate(this.edit_time_stamp).toLocaleString(luxon_1.DateTime.DATE_SHORT);
});
exports.Message = mongoose_1.default.model("Message", MessageSchema);
