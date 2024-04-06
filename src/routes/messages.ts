import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Message } from '../models/message';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

export const router = express.Router();

/* GET */
router.get('/', async function(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = user.first_name.length > 0 ? true : false;
  const messages = await Message.find({ user : user.id }).exec();

  res.render('messages', { title: 'Messages', messages: messages, errors: undefined, isLoggedIn: isLoggedIn });
});

router.get('/create', function(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = user.first_name.length > 0 ? true : false;
  res.render('message-form', { title: 'Create message', message: undefined, errors: undefined, isLoggedIn: isLoggedIn });
});

router.get('/update', function(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const message = Message.find({ 'user.id' : user.id }).exec();
  const isLoggedIn = user.first_name.length > 0 ? true : false;
  res.render('message-form', { title: 'Update message', message: message, errors: undefined, isLoggedIn: isLoggedIn });
});

/* POST */
router.post('/create', [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required.')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message is required.')
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    const user = res.locals.user;

    if (!error.isEmpty() || user.id === null) {
      const errors = error.array();

      if (user.id === null) {
        errors.push({
          type: 'field',
          value: req.body.text,
          msg: 'Faild to submit. You must get a member to submit a message.',
          path: 'text',
          location: 'body'
        });
      }

      res.render("message-form", { 
        title: 'Create message', 
        message: req.body,
        errors: errors
      });

      return;
    }

    try {
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        user: user.id
      });
      const result = await message.save();

      res.redirect("/messages");
    } catch (err) {
      return next(err);
    }

  })
]);