"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function verifyCallback(username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.findOne({ email: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            ;
            const match = yield bcryptjs_1.default.compare(password, user.hash);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
        ;
    });
}
const strategy = new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, verifyCallback);
passport_1.default.use(strategy);
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
    ;
}));
