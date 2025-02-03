const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const customerSchema = mongoose.Schema({
  customerId: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
    default: null,
  },
  timestamps: true,
});

customerSchema.pre("save", async function (next) {
  if (!this.customerId) {
    this.customerId = uuidV4();
  }

  let existingCustomer = await mongoose
    .model("customer")
    .findOne({ customerId: this.customerId });

  while (existingCustomer) {
    this.customerId = uuidV4();
    existingCustomer = await mongoose
      .model("customer")
      .findOne({ customerId: this.customerId });
  }
  next();
});

const customerModel = mongoose.model("customer", customerSchema);

module.exports = customerModel;
