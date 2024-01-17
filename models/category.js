const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true
  },

  status: {
    type: Boolean,
    default: true,
    required: true

  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }




}, { timestamps: true });

CategorySchema.methods.toJSON = function () {
  const { __v,status, ...category } = this.toObject()

  return category

}


const Category = mongoose.model('Category', CategorySchema)

module.exports = Category