const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongodb = require("./connection/db.connection");
const userRoute = require("./routers/user.router");
const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/user", userRoute);

mongodb(process.env.MONGODB_URL);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
