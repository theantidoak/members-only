import passport, { DoneCallback } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';
import { validatePassword } from '../utils/validatepassword';

const verifyCallback = (username: string, password: string, done: DoneCallback) => {

  User.findOne({ username: username })
      .then((user) => {

          if (!user) { return done(null, false) }
          
          const isValid = validatePassword(password, (user as any).hash, (user as any).salt);
          
          if (isValid) {
              return done(null, user);
          } else {
              return done(null, false);
          }
      })
      .catch((err) => {   
          done(err);
      });

}

const strategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  } as any, verifyCallback as any);

passport.use(strategy);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});