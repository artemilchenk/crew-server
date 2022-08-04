const User = require("../models/User")

async function getProfile(req, res) {
  const { id } = req.params;

  try {
    const profile = await User.findById(id);
    if (!profile) {
      return res.status(400).send({ message: "Profile does not exists" });
    }
    res.status(200).send({ profile });
  } catch (err) {
    throw new Error(err);
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;

  try {
    const profile = await User.findByIdAndUpdate(id, { ...req.body });
    if (!profile) {
      return res.status(400).send({ message: "Profile does not exists" });
    }
    res.status(200).send({ message: "U updated your profile" });
  } catch (err) {
    throw new Error(err);
  }
}

const ProfileControllers = {
  getProfile, updateProfile
};

export = ProfileControllers