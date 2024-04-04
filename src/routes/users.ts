import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const router = express.Router();

/* GET users listing. */
router.get('/', function(_req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

router.get('/sign-up', function(_req: Request, res: Response, next: NextFunction) {
  res.render('sign-up-form', { title: 'Sign Up' });
});

router.get('/login', function(_req: Request, res: Response, next: NextFunction) {
  res.render('login-form', { title: 'Sign Up' });
});

/* POST */

router.post(
  '/login', 
  passport.authenticate('local', { 
    failureRedirect: '/login-failure', 
    successRedirect: 'login-success' 
  })
);