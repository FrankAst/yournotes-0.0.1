// @flow

import User from '../models/user';

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

export default (passport: Object) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) done(err);
      done(null, user);
    });
  });

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ 'local.email': email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
          });
        });
      }
    )
  );

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        // asynchronous
        process.nextTick(() => {// eslint-disable-line
          // if the user is not already logged in:
          if (!req.user) {
            User.findOne({ 'local.email': email }, (err, user) => {// eslint-disable-line
              // if there are any errors, return the error
              if (err) return done(err);

              // check to see if theres already a user with that email
              if (user) {
                return done(
                  null,
                  false,
                  req.flash('signupMessage', 'That email is already taken.')
                );
              }

              // create the user
              const newUser = new User();

              newUser.local.email = email;
              newUser.local.name = req.body.name;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(err => {// eslint-disable-line
                if (err) return done(err);
                return done(null, newUser);
              });
            });
          } else if (!req.user.local.email) {
            User.findOne({ 'local.email': email }, (err, user) => { // eslint-disable-line
              if (err) return done(err);

              if (user) {
                return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
              }

              req.user.local.email = email;
              req.user.local.name = req.body.name;
              req.user.local.password = user.generateHash(password);
              user.save(err => {// eslint-disable-line
                if (err) return done(err);

                return done(null, user);
              });
            });
          } else {
            return done(null, req.user);
          }
        });
      }
    )
  );

  const fbStrategy = {
    clientID: '970979669706486',
    clientSecret: '3dacd04e55a29a43f57c835c77bf97e5',
    callbackURL: 'http://localhost:8090/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    passReqToCallback: false,
  };

  fbStrategy.passReqToCallback = true;
  passport.use(
    new FacebookStrategy(fbStrategy, (req, token, refreshToken, profile, done) => {
      // asynchronous
      process.nextTick(() => {
        // check if the user is already logged in
        if (!req.user) {
          User.findOne({ 'facebook.id': profile.id }, (err, user) => {  // eslint-disable-line
            if (err) return done(err);

            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.facebook.token) {
                user.facebook.token = token;// eslint-disable-line
                user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;// eslint-disable-line
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();// eslint-disable-line

                user.save(error => {
                  if (error) return done(error);

                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
            }
            // if there is no user, create them
            const newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(err => {// eslint-disable-line
              if (err) return done(err);
              return done(null, newUser);
            });
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          const user = req.user; // pull the user out of the session

          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.facebook.email = (profile.emails[0].value || '').toLowerCase();

          user.save(err => {
            if (err) return done(err);

            return done(null, user);
          });
        }
      });
    })
  );
};
