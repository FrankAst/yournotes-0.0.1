// @flow

import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/yournotes', { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', err => {
  console.log('Сonnection error:', err.message);
});

db.once('open', () => {
  console.log('Connected to DB!');
});
