const storeModel = require("../models/stores.model");
const jwt = require("jsonwebtoken");

const allowedKeys = ["username", "password"];

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .json({ message: "missing credentials", status: false });
    }
    const existingUser = await storeModel.findOne({ username });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "username already exists", status: false });
    }
    try {
      const extraKeys = Object.keys(req.body).filter(
        (key) => !allowedKeys.includes(key)
      );
      if (extraKeys.length > 0) {
        return res
          .status(401)
          .json({ message: "invalid schema", status: false });
      }
      const newUser = await storeModel.create(req.body);
      if (!newUser) {
        return res.status(403).json({
          message: "an error occur while creating user",
          status: false,
        });
      }
      return res
        .status(200)
        .json({ message: "store account created", status: true });
    } catch (error) {
      return res.sendStatus(500);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username | !password) {
      return res
        .status(401)
        .json({ message: "missing credentials", status: false });
    }
    try {
      const loggedInStore = await storeModel.findOne(username);
      if (!loggedInStore) {
        return res
          .status(403)
          .json({ message: "user not found", status: false });
      }
      const payload = {
        sub: loggedInStore.username,
        role: "store",
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "30m",
      });
      if (!token) {
        return res.sendStatus(403);
      }
      return res
        .status(200)
        .json({ message: "login successful", status: true, token });
    } catch (error) {
      return res.sendStatus(500);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = { register, login };
