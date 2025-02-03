const mongoose = require("mongoose");

const mongoDbConnection = async (url) => {
  try {
    const connected = await mongoose.connect(url, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    if (!connected) return console.log("Connection with mongodb failed");
    return console.log("connection with mongodb establshed");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoDbConnection;
