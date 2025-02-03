const userModel = require("../models/users.model");

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

module.exports = { register };
