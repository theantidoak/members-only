import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Message } from '../models/message';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

function checkIfFetch(req: Request, res: Response, next: NextFunction) {
  const xRequestedWith = req.headers['x-requested-with'];
  const isXmlHttpRequest = typeof xRequestedWith === 'string' && xRequestedWith.toLowerCase() === 'xmlhttprequest';

  if (!isXmlHttpRequest) {
    res.redirect('/messages');
  } else {
    next();
  }
}

export const router = express.Router();

/* GET */
router.get('/', async function(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = user.first_name.length > 0 ? true : false;
  const messages = await Message.find({ user : user.id }).sort({ time_stamp: -1 }).exec();

  res.render('messages', { title: 'Messages', messages: messages, errors: undefined, isLoggedIn: isLoggedIn });
});

router.get('/card', checkIfFetch, async function(req: Request, res: Response, next: NextFunction) {
  const id = req.query.id ?? '';
  const message = await Message.findOne({ '_id' : id }).exec();

  res.render('message-card', { title: 'Create message', message: message });
});

router.get('/create', checkIfFetch, function(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const isLoggedIn = user.first_name.length > 0 ? true : false;
  
  res.render('message-form', { title: 'Create message', message: undefined, errors: undefined, isLoggedIn: isLoggedIn, form: 'create' });
});

router.get('/update', checkIfFetch, async function(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const id = req.query.id ?? '';
  const message = await Message.findOne({ '_id' : id }).exec();
  const isLoggedIn = user.first_name.length > 0 ? true : false;

  res.render('message-form', { title: 'Update message', message: message, errors: undefined, isLoggedIn: isLoggedIn, form: 'update' });
});

router.get('/delete', checkIfFetch, async function(req: Request, res: Response, next: NextFunction) {
  const { error } = req.query;
  const errorMessage = error === undefined || error === 'undefined' ? undefined : error;
  res.render('delete-message-verification', { title: 'Delete message', error: errorMessage });
});

/* POST */
router.post('/create', [
  body('id')
    .trim()
    .escape(),
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required.')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message is required.')
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    const user = res.locals.user;

    if (!error.isEmpty() || user.id === null) {
      const errors = error.array();
      const isLoggedIn = user.first_name.length > 0 ? true : false;

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

router.post('/update', [
  body('id')
    .trim()
    .escape(),
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
      const isLoggedIn = user.first_name.length > 0 ? true : false;

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
        time_stamp: Date.now(),
        user: user.id
      };
      const updatedMessage = await Message.findByIdAndUpdate(req.body.id, newMessage, { new: true });

      res.redirect("/messages");
    } catch (err) {
      return next(err);
    }

  })
]);

router.post('/delete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await Message.findByIdAndDelete(req.body.id);

      if (!message) {
        return res.json({ success: false, message: 'Message not found' });
      }

      res.json({ success: true, message: 'Message successfully deleted' });
    } catch (error) {
      res.json({ success: false, message: 'Error deleting message' });
    }
  }
);