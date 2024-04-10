const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).send("Access denied. No token provided.");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    // below line decode the token through config key
    const decodedPayLoad = jwt.verify(token, "shhhhh");
    req.user = decodedPayLoad;

    //give permission to enter in api and can get access
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
