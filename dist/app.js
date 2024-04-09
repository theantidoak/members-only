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
exports.app = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const user_1 = require("./routes/user");
const messages_1 = require("./routes/messages");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, (process.env.NODE_ENV == "development" ? '..' : ''), 'public')));
mongoose_1.default.set("strictQuery", false);
const mongoDBLocal = "mongodb://127.0.0.1:27017/members_only";
const mongoDB = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.zp8czot.mongodb.net/members_only?retryWrites=true&w=majority`
    || "mongodb+srv://user:password@cluster0.zp8czot.mongodb.net/members_only?retryWrites=true&w=majority";
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const isLocal = false;
        yield mongoose_1.default.connect(isLocal ? mongoDBLocal : mongoDB);
    });
}
connectDB().catch((err) => console.log(err));
// view engine setup
exports.app.set('views', path_1.default.join(__dirname, 'views'));
exports.app.set('view engine', 'ejs');
exports.app.use((0, express_session_1.default)({
    store: connect_mongo_1.default.create({ mongoUrl: mongoDB, collectionName: 'sessions' }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
exports.app.use(passport_1.default.session());
exports.app.use((req, res, next) => {
    res.locals.user = { id: null, first_name: '', last_name: '', email: '', membership_status: '', hash: '', messages: [] };
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
});
exports.app.use('/', user_1.router);
exports.app.use('/messages', messages_1.router);
// catch 404 and forward to error handler
exports.app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
exports.app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env').toLowerCase() === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
