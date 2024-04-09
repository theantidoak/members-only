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
const message_1 = require("../models/message");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function checkIfFetch(req, res, next) {
    const xRequestedWith = req.headers['x-requested-with'];
    const isXmlHttpRequest = typeof xRequestedWith === 'string' && xRequestedWith.toLowerCase() === 'xmlhttprequest';
    if (!isXmlHttpRequest) {
        res.redirect('/');
    }
    else {
        next();
    }
}
exports.router = express_1.default.Router();
/* GET */
exports.router.get('/message', checkIfFetch, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id = (_a = req.query.id) !== null && _a !== void 0 ? _a : '';
        const message = yield message_1.Message.findOne({ '_id': id }).populate('user').exec();
        res.render('message-list-item', { title: 'Create message', message: message });
    });
});
exports.router.get('/create', checkIfFetch, function (req, res, next) {
    const user = res.locals.user;
    const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
    res.render('message-create-form', { title: 'Create message', message: undefined, errors: undefined, isLoggedIn: isLoggedIn, form: 'create' });
});
exports.router.get('/update', checkIfFetch, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = res.locals.user;
        const id = (_a = req.query.id) !== null && _a !== void 0 ? _a : '';
        const message = yield message_1.Message.findOne({ '_id': id }).exec();
        const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
        res.render('message-create-form', { title: 'Update message', message: message, errors: undefined, isLoggedIn: isLoggedIn, form: 'update' });
    });
});
exports.router.get('/delete', checkIfFetch, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = req.query;
        const errorMessage = error === undefined || error === 'undefined' ? undefined : error;
        res.render('message-delete-form', { title: 'Delete message', error: errorMessage });
    });
});
/* POST */
exports.router.post('/create', [
    (0, express_validator_1.body)('id')
        .trim()
        .escape(),
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title is required.')
        .escape(),
    (0, express_validator_1.body)('text')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Message is required.')
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        const user = res.locals.user;
        if (!error.isEmpty() || user.id === null) {
            const errors = error.array();
            const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
            if (user.id === null) {
                errors.push({
                    type: 'field',
                    value: req.body.text,
                    msg: 'Failed to submit. You must be a member to submit a message.',
                    path: 'text',
                    location: 'body'
                });
            }
            res.render("message-form", {
                title: 'Create message',
                message: req.body,
                errors: errors,
                isLoggedIn: isLoggedIn,
                form: 'create'
            });
            return;
        }
        try {
            const message = new message_1.Message({
                title: req.body.title,
                text: req.body.text,
                user: user.id
            });
            const result = yield message.save();
            res.redirect(`/#${result.id}`);
        }
        catch (err) {
            return next(err);
        }
    }))
]);
exports.router.post('/update', [
    (0, express_validator_1.body)('id')
        .trim()
        .escape(),
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title is required.')
        .escape(),
    (0, express_validator_1.body)('text')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Message is required.')
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        const user = res.locals.user;
        if (!error.isEmpty() || user.id === null) {
            const errors = error.array();
            const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
            if (user.id === null) {
                errors.push({
                    type: 'field',
                    value: req.body.text,
                    msg: 'Failed to submit. You must be a member to update a message.',
                    path: 'text',
                    location: 'body'
                });
            }
            res.render("message-form", {
                title: 'Create message',
                message: req.body,
                errors: errors,
                isLoggedIn: isLoggedIn,
                form: 'update'
            });
            return;
        }
        try {
            const newMessage = {
                title: req.body.title,
                text: req.body.text,
                edit_time_stamp: Date.now(),
                user: user.id
            };
            const result = yield message_1.Message.findByIdAndUpdate(req.body.id, newMessage, { new: true });
            res.redirect(`/#${req.body.id}`);
        }
        catch (err) {
            return next(err);
        }
    }))
]);
exports.router.post('/delete', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield message_1.Message.findByIdAndDelete(req.body.id);
        if (!message) {
            return res.json({ success: false, message: 'Message not found' });
        }
        res.json({ success: true, message: 'Message successfully deleted' });
    }
    catch (error) {
        res.json({ success: false, message: 'Error deleting message' });
    }
}));
