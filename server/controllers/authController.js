const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/email");

const generateToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

//Register User
//  
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔍 Check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🧹 Delete old OTPs
    await OTP.deleteMany({ email, action: "account_verification" });

    // 💾 Save OTP
    await OTP.create({
      email,
      otp,
      action: "account_verification",
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 min
    });

    // 📩 Send OTP Email
    await sendOtpEmail(email, otp, "account_verification");

    // ✅ Single response
    res.status(201).json({
      message: "User registered. Please verify OTP sent to email.",
      email: user.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  if(!user.isVerified && user.role === 'user'){
    const otp = Math.floor(100000 + Math.random() * 900000);


    await OTP.deleteMany({email, action: 'account_verification'}); // Clear old OTPs
    await OTP.create({email, otp, action: 'account_verification'});
    await sendOtpEmail(email, otp, 'account_verification');
    return res.status(400).json({ error: "Account not verified. A new OTP has been sent to your email."

     });
  }

  res.json({
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role)

  })
  
};

//verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification"
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ⏱️ Expiry check
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    await OTP.deleteMany({ email, action: "account_verification" });

    res.json({
      message: "Account verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
