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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.router = express_1.default.Router();
/* GET */
exports.router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const messages = yield message_1.Message.find().populate('user').sort({ time_stamp: -1 }).exec();
        const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
        const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
        res.render('index', { title: 'Members Only', user: user, isLoggedIn: isLoggedIn, isMember: isMember, messages: messages });
    });
});
exports.router.get('/account', function (_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = res.locals.user;
        const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
        const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
        const messages = yield message_1.Message.find({ user: user.id }).populate('user').sort({ edit_time_stamp: -1 }).exec();
        res.render('account', { title: 'Account', user: user, messages: messages, errors: undefined, isLoggedIn: isLoggedIn, isMember: isMember });
    });
});
exports.router.get('/register', function (_req, res, next) {
    res.render('user-register-form', { title: 'Register', user: undefined, errors: undefined });
});
exports.router.get('/login', function (_req, res, next) {
    res.render('user-login-form', { title: 'Login', user: undefined, errors: undefined });
});
exports.router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
exports.router.get('/membership', function (req, res, next) {
    const user = res.locals.user;
    const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
    const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
    const isAdmin = user.membership_status === 'admin' ? true : false;
    res.render('user-membership-form', { title: 'Membership', user: user, errors: undefined, isLoggedIn: isLoggedIn, isMember: isMember, isAdmin: isAdmin });
});
/* POST */
exports.router.post('/register', [
    (0, express_validator_1.body)("first_name")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("First name must be specified.")
        .matches(/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF' -]+$/)
        .withMessage('First name contains invalid characters.')
        .escape(),
    (0, express_validator_1.body)("last_name")
        .trim()
        .isLength({ max: 50 })
        .optional({ checkFalsy: true })
        .matches(/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF' -]*$/)
        .withMessage('Last name contains invalid characters.')
        .escape(),
    (0, express_validator_1.body)('email')
        .trim()
        .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .escape(),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/\d/)
        .withMessage('Password must contain a number.')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain a special character.')
        .escape(),
    (0, express_validator_1.body)('confirm_password')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Confirm password is required.')
        .custom((value, { req }) => {
        return value === req.body.password;
    })
        .withMessage('Passwords must match.')
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const error = (0, express_validator_1.validationResult)(req);
        const userExists = yield user_1.User.findOne({ email: req.body.email }).exec();
        if (!error.isEmpty() || userExists) {
            const errors = error.array();
            if (userExists) {
                errors.push({
                    type: 'field',
                    value: req.body.email,
                    msg: 'User already exists. Please choose another email.',
                    path: 'email',
                    location: 'body'
                });
            }
            res.render("user-register-form", {
                title: "Register",
                user: req.body,
                errors: errors
            });
            return;
        }
        try {
            const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
            const user = new user_1.User({
                first_name: req.body.first_name,
                last_name: (_a = req.body.last_name) !== null && _a !== void 0 ? _a : '',
                email: req.body.email,
                hash: hashedPassword
            });
            const result = yield user.save();
            req.login(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.redirect("/membership");
            });
        }
        catch (err) {
            return next(err);
        }
    }))
]);
exports.router.post('/login', [
    (0, express_validator_1.body)('email')
        .trim()
        .escape(),
    (0, express_validator_1.body)('password')
        .trim()
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        passport_1.default.authenticate('local', function (err, user, info) {
            const error = (0, express_validator_1.validationResult)(req);
            if (!error.isEmpty() || err || !user) {
                const errors = error.array();
                if (err || !user) {
                    errors.push({
                        type: 'field',
                        value: req.body.email,
                        msg: 'Invalid username or password. Please try again.',
                        path: 'email',
                        location: 'body'
                    });
                }
                res.render("user-login-form", {
                    title: "Login",
                    user: req.body,
                    errors: errors
                });
                return;
            }
            req.login(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
                return isMember ? res.redirect("/") : res.redirect("/membership");
            });
        })(req, res, next);
    }))
]);
exports.router.post('/membership', [
    (0, express_validator_1.body)('passcode')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Passcode is required.')
        .custom((value, { req }) => {
        return value === process.env.PASSCODE;
    })
        .withMessage('Incorrect Passcode.')
        .escape(),
    (0, express_validator_1.body)('admin')
        .toBoolean(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        const email = res.locals.user.email;
        if (!error.isEmpty()) {
            const user = res.locals.user;
            const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
            const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
            const isAdmin = user.membership_status === 'admin' ? true : false;
            res.render("user-membership-form", { title: 'Membership', user: user, errors: undefined, isLoggedIn: isLoggedIn, isMember: isMember, isAdmin: isAdmin });
            return;
        }
        try {
            const membershipStatus = req.body.admin ? 'admin' : 'member';
            const result = yield user_1.User.findOneAndUpdate({ email: email }, { membership_status: membershipStatus }, { new: true }).exec();
            res.redirect("/");
        }
        catch (err) {
            return next(err);
        }
    }))
]);
