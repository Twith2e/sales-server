const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
