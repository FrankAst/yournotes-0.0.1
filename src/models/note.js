// @flow

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String },
  date: { type: String },
  content: { type: String },
  color: { type: String },
});

const NoteModel = mongoose.model('notes', noteSchema);

export default NoteModel;
