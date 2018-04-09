const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true
    },
    avatar_url: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

UserSchema.virtual('Articles', {
  ref: 'articles',
  localField: '_id',
  foreignField: 'created_by',
  justOne: false
});
UserSchema.virtual('Comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'created_by',
  justOne: false
});

module.exports = mongoose.model('users', UserSchema);
