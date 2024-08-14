const nodemailer = require("nodemailer");
const ForgotPassword = require("../models/forgotPassword");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smpt.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "filmfreenzy.me@gmail.com",
    pass: "zccz ozjh cqmd ptlf",
  },
});

exports.getForgotPasswordList = async (req, res) => {
  try {
    const list = await ForgotPassword.find();
    res.json({ data: list }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createForgotPassword = async (req, res) => {
  const { email } = req.body;

  const forgotUser = await User.findOne({ email });

  if (!forgotUser)
    return res.status(404).json({ message: "User does not exist!" });

  const isExistUser = await ForgotPassword.findOne({ email });
  if (isExistUser)
    return res
      .status(400)
      .json({ message: "Already requested, Admins will take care of it" });

  const forgotPasswordSchema = new ForgotPassword({
    email: forgotUser.email,
    name: forgotUser.name,
  });
  try {
    await forgotPasswordSchema.save();
    res.status(200).json({ message: "Successfully Submitted!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.params;
  const mailOptions = {
    from: "filmfreenzy.me@gmail.com",
    to: email,
    subject: "Test Email (no reply)",
    text: "This is a test email from Nodemailer",
  };
  try {
    const salt = await bcrypt.genSalt(10);

    const newPassword = generatePassword(
      Math.floor(Math.random() * (12 - 8 + 1)) + 8
    );
    mailOptions.text = `New Password: ${newPassword}`;
    const encryptedPassword = await bcrypt.hash(newPassword, salt);
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: encryptedPassword } },
      {
        new: true,
      }
    );
    mailOptions.subject = `This is New Password: ${newPassword}`;
    const info = await transporter.sendMail(mailOptions);
    await ForgotPassword.findOneAndDelete({ email: email });
    res
      .json({ message: info.messageId, count: newPassword.length, user })
      .status(200);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

function generatePassword(length = 8) {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_-+=";

  const allCharacters =
    uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

  let password = "";

  // Ensure at least one of each required character type
  password +=
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  password +=
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Generate remaining characters randomly
  for (let i = 4; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password characters for better randomness
  password = password.split("");
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  password = password.join("");

  return password;
}
