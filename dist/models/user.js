"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const Schema = mongoose_1.default.Schema;
exports.UserSchema = new Schema({
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
exports.UserSchema.virtual("name").get(function () {
    const firstName = lodash_1.default.capitalize(this.first_name);
    const lastName = this.last_name && this.last_name.length > 0 ? lodash_1.default.capitalize(this.last_name) : '';
    return `${firstName} ${lastName}`;
});
exports.User = mongoose_1.default.model("User", exports.UserSchema);
