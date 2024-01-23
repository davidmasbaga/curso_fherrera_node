const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    available: { type: Boolean },
  },
  { timestamps: true }
);

ProductSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();

  return data;
};

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
