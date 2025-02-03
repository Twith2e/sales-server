const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  accessRole: {
    type: String,
    trim: true,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
});

const saltRound = 10;

userSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, saltRound);
    if (!hashedPassword) return new Error("something went wrong");
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (!update.$set || !update.$set.password) return;
    update.$set.password = await bcrypt.hash(update.$set.password, saltRound);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordTokenExpiry = Date.now() + 600000;

  return resetToken;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
