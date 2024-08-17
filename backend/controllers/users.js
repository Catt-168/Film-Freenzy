const User = require("../models/user");
const Rental = require("../models/rental");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const { pageSize, page, filterKeyWord } = req.query;
    const skip = (page - 1) * pageSize;

    let filter = {};

    if (filterKeyWord.length !== 0) {
      if (filterKeyWord === "All") {
      } else filter.isAdmin = filterKeyWord === "Admins";
    }

    const users = await User.find(filter, "-__v -password")
      .limit(pageSize)
      .skip(skip);
    const totalItems = await User.countDocuments(filter);
    const totalPages =
      totalItems % pageSize === 0
        ? totalItems / pageSize
        : totalItems / pageSize + 1;

    const metaData = {
      currentPage: parseInt(page),
      totalPages: parseInt(totalPages),
    };
    res.json({ users, metaData }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getUserDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Not Found" });
    res.send(user).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createUser = async (req, res) => {
  const imageData = req.file
    ? {
        name: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path,
      }
    : null;

  const userSchema = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
    dob: req.body.dob,
    image: imageData,
  });

  try {
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser)
      return res
        .status(409)
        .json({ message: "Another User with same idenity exists!" });
    const salt = await bcrypt.genSalt(10);
    userSchema.password = await bcrypt.hash(req.body.password, salt);
    const user = await userSchema.save();
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };

  const oldUser = await User.findById(id);

  const imageData = req.file
    ? {
        name: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path,
      }
    : oldUser.image;

  const update = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    payment: req.body.payment,
    image: imageData,
  };

  // console.log(req.body.payment);
  try {
    const updateduser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    await Rental.updateMany(
      { "customer._id": id },
      { "customer.name": update.name },
      { new: true }
    );

    res.status(200).json(updateduser);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    const isUserPurchased = await Rental.findOne({
      "customer.name": user.name,
    });

    if (!!isUserPurchased)
      return res
        .status(405)
        .json({ message: "Can not deleted users who purchased" });

    await User.deleteOne(user);
    await Rental.deleteMany({ "customer._id": id });
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
