import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/; // regex for password

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  // validating data from frontend
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Full Name must be at least 3 letters long" });
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

  return res.status(200).json({ status: "ok" });
});

server.listen(PORT, () => {
  console.log("listening on port -> " + PORT);
});
