const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      requied: true
    },
    belongs_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'topics',
      required: true
    },
    votes: {
      type: Number,
      required: true,
      default: 0
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  },
  { toJSON: { virtuals: true } }
);
ArticleSchema.virtual('Comments', {
  ref: 'comments', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'belongs_to', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
});

module.exports = mongoose.model('articles', ArticleSchema);
