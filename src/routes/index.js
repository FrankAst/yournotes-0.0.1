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
      cookies: { maxAge: 36000000 },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  const isLoggedIn = (req, res, next) => { //eslint-disable-line
    if (req.isAuthenticated()) return next();
    res.status(403).send('Login firstly, please!');
  };

  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      return Note.find({ userId: req.user._id }, (err, notes) => {
        if (!err) {
          return res.render('mainView', { title: req.user.name, notes });
        }
        res.statusCode = 500;
        return res.send({ error: 'Server error' });
      });
    }
    const notes = [
      {
        title: 'Title example',
        content: 'For create your own notes, login firstly, please.',
        date: '00:00 | 21.12.2012',
        color: '#246703',
      },
      {
        title: 'Awesome note',
        content: 'For create your own notes, login firstly, please.',
        date: '00:00 | 21.12.2012',
        color: '#ffd700',
      },
    ];
    return res.render('mainView', { title: 'Great person!', notes });
  });

  app.post('/notes', isLoggedIn, (req, res) => {
    const { title, content, color, date } = req.body;
    const note = new Note({
      userId: req.user._id,
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
        return res.send(err, { error: 'Server error' });
      }
    });
  });

  app.post('/mail', (req, res) => {
    const { email, message, name } = req.body;
    mail(email, message, name);
    console.log('inside mail controller');
    res.send('ok');
  });

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
      req.login(user, error => {
        if (error) {
          console.log(error);
          return;
        }
        res.send(user);
      });
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
};
