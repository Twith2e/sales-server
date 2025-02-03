const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const inventorySchema = mongoose.Schema({
  invetoryId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  productId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  quantityAdded: {
    type: Number,
    trim: true,
    default: 0,
  },
  quantitySold: {
    type: Number,
    trim: true,
    default: 0,
  },
  stockLevel: {
    type: Number,
    trim: true,
    default: 0,
  },
  timestamps: true,
});

inventorySchema.pre("save", async function (next) {
  if (!this.inventoryId) {
    this.inventory = uuidV4();
  }

  let existingInventory = await mongoose
    .model("inventory")
    .findOne({ inventoryId: this.inventoryId });
  while (existingInventory) {
    this.inventoryId = uuidV4();
    existingInventory = await mongoose
      .model("inventory")
      .findOne({ inventoryId: this.inventoryId });
  }
  next();
});

const inventoryModel = mongoose.model("inventory", inventorySchema);

module.exports = inventoryModel;
