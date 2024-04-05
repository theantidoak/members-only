import passport, { DoneCallback } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';

async function verifyCallback(username: string, password: any, done: any) {

  try {
    const user = await User.findOne({ email: username });
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
    usernameField: 'email',
    passwordField: 'password',
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