require('dotenv').config()
const User = require("../models/User")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { name, password, email } = req.body;

    const candidate = await User.findOne({ name });
    if (candidate) {
      return res.status(400).send({ message: "This User already exists" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: errors.array()[0].param === "password"
          ? "Password should be longer than 6 characters"
          : "email is not correct"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new User({
      name,
      password: hashedPassword,
      email,
      phone: "",
      instagram: "",
      facebook: "",
      about: "",
      location: "",
      role: ["Developer"],
      posts: [],
      createdAt: new Date().toISOString()
    });

    const newUser = await user.save();
    res.status(200).send({ user: newUser, message: "Your profile was created!!!" });

  } catch (err) {
    throw new Error(err);
  }
}

async function login(req, res) {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).send({ message: "User is not registered" });
    }

    const comperePasswords = await bcrypt.compareSync(password, user.password);
    if (!comperePasswords) {
      return res.status(400).send({ message: "Password is not correct" });
    }

    const token = jwt.sign({
      id: user._id,
      name: user.name
    }, 'crew_cooperating', { expiresIn: "24h" });

    res.status(200).send({ user, token });

  } catch (err) {
    throw new Error(err);
  }
}

async function getUser(req, res) {
  let name = req.body.name;
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).send({ message: "User is not registered" });
    }
    res.status(200).send({ user });

  } catch (err) {
    throw new Error(err);
  }
}

async function getUsers(req, res) {
  try {

    console.log(process.env.SECRET_KEY);
    const users = await User.find();
    res.status(200).send({ users });

  } catch (err) {
    throw new Error(err);
  }
}

const UserControllers = {
  register, login, getUser, getUsers
};

export = UserControllers

