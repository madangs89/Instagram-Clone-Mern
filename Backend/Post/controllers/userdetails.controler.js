import Userdetails from "../models/user.model";

export const createUser = async (req, res) => {
  try {
    const { _id, name, userName, avatar } = req.user;
    if (!_id || !name || !userName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Userdetails.findOne({ _id });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new Userdetails({ _id, name, userName, avatar });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User created", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await Userdetails.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await Userdetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await Userdetails.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
