import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/user';
import { Message } from '../models/message';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

export const router = express.Router();

/* GET */

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const messages = await Message.find().populate('user').sort({ time_stamp: -1 }).exec();
  const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
  const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
  
  res.render('index', { title: 'Members Only', user: user, isLoggedIn: isLoggedIn, isMember: isMember, messages: messages });
});

router.get('/account', async function(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
  const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
  const messages = await Message.find({ user : user.id }).populate('user').sort({ edit_time_stamp: -1 }).exec();

  res.render('account', { title: 'Account', user: user, messages: messages, errors: undefined, isLoggedIn: isLoggedIn, isMember: isMember });
});

router.get('/register', function(_req: Request, res: Response, next: NextFunction) {
  res.render('user-register-form', { title: 'Register', user: undefined, errors: undefined });
});

router.get('/login', function(_req: Request, res: Response, next: NextFunction) {
  res.render('user-login-form', { title: 'Login', user: undefined, errors: undefined });
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    
    res.redirect("/");
  });
});

router.get('/membership', function(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = ['user', 'member', 'admin'].includes(user.membership_status) ? true : false;
  const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
  const isAdmin = user.membership_status === 'admin' ? true : false;

  res.render('user-membership-form', { title: 'Membership', user: user, errors: undefined, isLoggedIn: isLoggedIn, isMember: isMember, isAdmin: isAdmin });
});


/* POST */
router.post('/register', [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be specified.")
    .matches(/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF' -]+$/)
    .withMessage('First name contains invalid characters.')
    .escape(),
  body("last_name")
    .trim()
    .isLength({ max: 50 })
    .optional({ checkFalsy: true })
    .matches(/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF' -]*$/)
    .withMessage('Last name contains invalid characters.')
    .escape(),
  body('email')
    .trim()
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .escape(),
  body('password')
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
  body('confirm_password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Confirm password is required.')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords must match.')
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    const userExists = await User.findOne({ email: req.body.email }).exec();

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
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name ?? '',
        email: req.body.email,
        hash: hashedPassword
      });
      const result = await user.save();

      req.login(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }

        return res.redirect("/membership")
      });

    } catch (err) {
      return next(err);
    }

  })
]);

router.post('/login', [
  body('email')
    .trim()
    .escape(),
  body('password')
    .trim()
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function(err: any, user: any, info: any) {
      const error = validationResult(req);

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

      req.login(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }

        const isMember = ['member', 'admin'].includes(user.membership_status) ? true : false;
        return isMember ? res.redirect("/") : res.redirect("/membership")
      });      
    })(req, res, next)
  })
]);

router.post('/membership', [
  body('passcode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Passcode is required.')
    .custom((value, { req }) => {
      return value === process.env.PASSCODE;
    })
    .withMessage('Incorrect Passcode.')
    .escape(),
  body('admin')
    .toBoolean(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
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
      const result = await User.findOneAndUpdate({ email: email }, { membership_status: membershipStatus }, { new: true }).exec();
      
      res.redirect("/");
    } catch (err) {
      return next(err);
    }

  })
]);