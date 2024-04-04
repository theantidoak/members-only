import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from '../models/user';

export const router = express.Router();

/* GET users listing. */
router.get('/', function(_req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

router.get('/register', function(_req: Request, res: Response, next: NextFunction) {
  res.render('register-form', { title: 'Sign Up' });
});

router.get('/login', function(_req: Request, res: Response, next: NextFunction) {
  res.render('login-form', { title: 'Sign Up' });
});

/* POST */

router.post("/register", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    } else {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword
        });
        const result = await user.save();
        res.redirect("/");
      } catch(err) {
        return next(err);
      };
    }
  });
});

router.post(
  '/login', 
  passport.authenticate('local', { 
    failureRedirect: '/login-failure', 
    successRedirect: 'login-success' 
  })
);