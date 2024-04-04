import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport';

import { router as indexRouter } from './routes/index';
import { router as userRouter } from './routes/user';

dotenv.config();

export const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, (process.env.NODE_ENV == "DEVELOPMENT" ? '..' : ''), 'public')));

mongoose.set("strictQuery", false);
const mongoDBLocal = "mongodb://127.0.0.1:27017/members_only";
const mongoDB = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.zp8czot.mongodb.net/members_only?retryWrites=true&w=majority`
  || "mongodb+srv://user:password@cluster0.zp8czot.mongodb.net/members_only?retryWrites=true&w=majority";

async function connectDB() {
  const isLocal = false;
  await mongoose.connect(isLocal ? mongoDBLocal : mongoDB);
}

connectDB().catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: MongoStore.create({ mongoUrl: mongoDB, collectionName: 'sessions' }),
  secret: process.env.SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env').toLowerCase() === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
