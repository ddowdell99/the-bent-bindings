import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

// Schema Below:
import User from "../server/Schema/User.js";

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
  };
};

server.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;

  // validating data from frontend
  if (username.length < 3) {
    return res
      .status(403)
      .json({ error: "Username must be at least 3 letters long" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Please provide an email." });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password must be greater than 8 characters with 1 number, 1 lowercase, 1 uppercase letter and 1 special character!",
    });
  }

  try {
    const usernameExists = await User.exists({
      "personal_info.username": username,
    });
    if (usernameExists) {
      return res.status(400).json({ error: "Username already exists." });
    }
    const emailExists = await User.exists({ "personal_info.email": email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists." });
    }
    const hashed_password = await bcrypt.hash(password, 10);

    const user = new User({
      personal_info: { username, email, password: hashed_password },
    });

    const savedUser = await user.save();
    return res.status(200).json(formatDatatoSend(savedUser));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(403).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Incorrect password!" });
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
});

server.listen(PORT, () => {
  console.log("listening on port -> " + PORT);
});
