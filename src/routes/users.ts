import express, { Request, Response, NextFunction } from 'express';

export const router = express.Router();

/* GET users listing. */
router.get('/', function(_req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

router.get('/sign-up', function(_req: Request, res: Response, next: NextFunction) {
  res.render('sign-up-form', { title: 'Sign Up' });
});
