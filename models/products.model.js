const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const productSchema = mongoose.Schema({
  productId: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  quantity: {
    type: Number,
    trim: true,
    required: true,
  },
  sku: {
    type: String,
    trim: true,
    required: true,
  },
  timestamps: true,
});

productSchema.pre("save", async function (next) {
  if (!this.productId) {
    this.productId = uuidV4();
  }

  let existingProduct = await mongoose
    .model("product")
    .findOne({ productId: this.productId });
  while (existingProduct) {
    this.productId = uuidV4();
    existingProduct = await mongoose
      .model("product")
      .findOne({ productId: this.productId });
  }
  next();
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
