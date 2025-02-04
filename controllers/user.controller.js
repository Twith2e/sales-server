const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const allowedKeys = ["username", "password", "accessRole"];

const register = async (req, res, next) => {
  try {
    const { username, password, accessRole } = req.body;
    if (!username || !password || !accessRole) {
      console.log("missing");
      return res
        .status(401)
        .json({ message: "Missing credentials", status: false });
    }
    const existingUser = await userModel.findOne({ username });
    if (!existingUser) {
      try {
        const extraKeys = Object.keys(req.body).filter(
          (key) => !allowedKeys.includes(key)
        );
        if (extraKeys.length > 0) {
          return res
            .status(401)
            .json({ message: "invalid schema", status: false });
        }
        const newUser = userModel.create(req.body);
        if (!newUser) {
          return res
            .status(401)
            .json({ message: "Unable to create new user", status: false });
        }
        res
          .status(200)
          .json({ message: "Profile created sucessfully", status: true });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(400).json({
      message:
        "Username already taken, if you are the owner, kindly proceed to login",
      status: false,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(401)
      .json({ message: "missing credential", status: false });
  }
  try {
    const loggedInUser = await userModel.findOne({ username });
    if (!loggedInUser) {
      return res
        .status(400)
        .json({ message: "User does not exist", status: false });
    }
    const passwordMatch = await bcrypt.compare(password, loggedInUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect login credentials", status: false });
    }
    const payload = {
      sub: loggedInUser.username,
      role: user,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30m",
    });
    if (!token) {
      return res
        .status(401)
        .json({ message: "Json token error", status: false });
    }
    return res
      .status(200)
      .json({ message: "login successful", status: true, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: false, error });
  }
};

module.exports = { register, login };
