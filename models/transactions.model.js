const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const transactionSchema = mongoose.Schema({
  salesId: {
    type: String,
    trim: true,
    required: true,
  },
  customerId: {
    type: String,
    trim: true,
    required: true,
  },
  employeeId: {
    type: String,
    trim: true,
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
        trim: true,
        required: true,
      },
      quantity: {
        type: Number,
        trim: true,
        required: true,
      },
      unitPrice: {
        type: Number,
        trim: true,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    trim: true,
    required: true,
  },
  paymentMethod: {
    type: String,
    trim: true,
    required: true,
  },
  saleDate: {
    type: Date,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    required: true,
  },
  timestamps: true,
});

transactionSchema.pre("save", async function (next) {
  if (!this.salesId) {
    this.salesId = uuidV4();
  }

  let existingTransaction = await mongoose
    .model("transaction")
    .findOne({ salesId: this.salesId });

  while (existingTransaction) {
    this.salesId = uuidV4();
    existingTransaction = await mongoose
      .model("transaction")
      .findOne({ salesId: this.salesId });
  }
  next();
});

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
