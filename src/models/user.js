// @flow

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    name: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});

userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function a(password) {
  return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('users', userSchema);

export default User;
