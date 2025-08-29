import bcrypt from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(userName, password);
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const user = await axios.get(
      `${process.env.USER_BACKEND}/user/${userName}/${password}`
    );
    const userData = user?.data?.user;
    if (!userData?._id && !userData?.userName) {
      return res
        .status(404)
        .json({ message: "userData not found", success: false, userName });
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign(
      {
        _id: userData._id,
        avatar: userData.avatar,
        userName: userData.userName,
        email: userData.email,
        name: userData.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7D",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "Login successful", success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error" + error.message,
      success: false,
      error: error.message || error,
    });
  }
};
export const register = async (req, res) => {
  try {
    const { userName, password, email, name, publicKey, encryptedPrivateKey } =
      req.body;
    if (!userName || !password || !email || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const { data } = await axios.get(
      `${process.env.USER_BACKEND}/user/${userName}/${email}`
    );
    if (data?.user?._id && data?.user?.userName && data?.user?.email) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    const newUser = await axios.post(`${process.env.USER_BACKEND}/user`, {
      userName,
      password,
      email,
      name,
      publicKey,
      encryptedPrivateKey,
    });
    const newData = newUser?.data?.user;
    const token = jwt.sign(
      {
        _id: newData._id,
        avatar: newData.avatar,
        userName: newData.userName,
        email: newData.email,
        publicKey: newData.publicKey,
        name: newData.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7D",
      }
    );
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Registration successful", success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
};
export const isAuth = async (req, res) => {
  try {
    if (!req.user && !res.user._id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    return res
      .status(200)
      .json({ message: "Authorized", success: true, user: req.user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
