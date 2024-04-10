const User = require("../models/user");

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password." });

  const validPassword = user.password === password;
  if (!validPassword)
    return res.status(400).json({ message: "Invalid email or password." });

  const token = user.generateAuthToken();
  res.json({ token: token, user: user });
};
