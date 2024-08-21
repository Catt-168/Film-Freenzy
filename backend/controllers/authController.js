const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Username or Password does not match." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ message: "Username or Password does not match." });

  const token = user.generateAuthToken();
  user.password = password;
  res.json({ token: token, user: user });
};
