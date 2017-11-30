// @flow

import flash from 'flash';
import session from 'express-session';
import passportConfig from './passport';
import mail from '../mail';
import Note from '../models/note';

export default (app, passport) => {
  passportConfig(passport);
  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  const isLoggedIn = (req, res, next) => { //eslint-disable-line
    if (req.isAuthenticated()) return next();
    return res.send('Login firstly, please!');
  };

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user) => { //eslint-disable-line
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send('Invalid login or password! Try again.');
      }
      return res.send(user);
    })(req, res, next);
  });

  app.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user) => { //eslint-disable-line
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send('Sorry, this email has already taken!');
      }
      return res.send(user);
    })(req, res, next);
  });

  // app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  //
  // app.get(
  //   '/auth/facebook/callback',
  //   passport.authenticate('facebook', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/',
  //   })
  // );
  //
  // app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
  //
  // app.get(
  //   '/connect/facebook/callback',
  //   passport.authorize('facebook', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/',
  //   })
  // );
  //
  // app.get('/unlink/facebook', isLoggedIn, (req, res) => {
  //   const user = req.user;
  //   user.facebook.token = undefined;
  //   user.save(err => {
  //     console.log(err);
  //     res.redirect('/profile');
  //   });
  // });

  app.get('/', (req, res) => {
    return Note.find((err, notes) => { //eslint-disable-line
      if (!err) {
        res.render('mainView', { title: 'Valeriy', notes });
      } else {
        res.statusCode = 500;
        console.err('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
        return res.send({ error: 'Server error' });
      }
    });
  });

  app.post('/notes', (req, res) => {
    let { title, content } = req.body;
    const { color, date } = req.body;
    if (title === '') {
      title = 'Empty title';
    }
    if (content === '') {
      content = 'Empty content';
    }
    const note = new Note({
      title,
      date,
      content,
      color,
    });
    note.save(err => {
      if (!err) {
        console.info('note created successfully!'); //eslint-disable-line
        res.statusCode = 200;
        res.send(note);
      } else {
        console.log(err); //eslint-disable-line
        if (err.name === 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        console.error('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
      }
    });
  });

  app.delete('/notes', (req, res) => {
    return Note.findByIdAndRemove({ _id: req.query.id }, err => { //eslint-disable-line
      if (!err) {
        res.statusCode = 200;
        res.statusText = 'OK';
        res.end();
        console.log('remove successfully'); //eslint-disable-line
      } else {
        res.statusCode = 500;
        console.err('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
        return res.send({ error: 'Server error' });
      }
    });
  });

  app.post('/mail', (req, res) => {
    const { email, message, name } = req.body;
    mail(email, message, name);
    console.log('inside mail controller');
    res.send('ok');
  });
};
