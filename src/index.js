// @flow

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import routes from './routes';
import './db';

const PORT = 8090;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app, passport);

// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// app.use((err, req, res) => {
//   res.send('eeeerrrorrrrr');
// });

app.listen(PORT, () => {
  console.log(`App works on ${PORT}...`);  //eslint-disable-line
});
