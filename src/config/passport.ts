import passport, { DoneCallback } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';

const verifyCallback: any = async (username: string, password: string, done: any) => {

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    };
    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return done(null, false, { message: "Incorrect password" })
    }
    return done(null, user);
  } catch(err) {
    return done(err);
  };

}

const strategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, verifyCallback);

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