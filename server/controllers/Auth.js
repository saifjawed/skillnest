const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const OTP = require("../models/Otp");
const Profile = require("../models/Profile");

const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const {
  emailVerificationTemplate,
  otpTemplate,
} = require("../mail/templates/emailVerificationTemplate");

// ========================== SEND OTP ==========================
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      });
    }

    // Generate a unique OTP
    let otp;
    let existingOtp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOtp = await OTP.findOne({ otp });
    } while (existingOtp);

    // Save OTP to DB
    await OTP.create({ email, otp });

    // Send OTP via email
    const emailBody = otpTemplate(otp);
    await mailSender(email, "Verify Your OTP - StudyNotion", emailBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ========================== SIGNUP ==========================
exports.signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in.",
      });
    }

    // Get the latest OTP entry
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || String(otp) !== String(response[0].otp)) {
      return res.status(400).json({
        success: false,
        message: "No OTP Found for this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set approval based on account type
    let approved = accountType === "Instructor" ? false : true;

    // Create user profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    // Create user
    const user = await User.create({
      firstname,
      lastname,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname}%20${lastname}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log request info for debugging mobile issues
    console.log('Login Attempt:', {
      email,
      headers: req.headers,
      userAgent: req.headers['user-agent'],
      origin: req.headers['origin'],
      ip: req.ip,
    });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered. Please sign up.",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        sameSite: "None",
        token,
        user,
        message: "User login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    // Log error details for debugging
    console.error("Login Error:", error);
    console.error("Request Info:", {
      headers: req.headers,
      userAgent: req.headers['user-agent'],
      origin: req.headers['origin'],
      ip: req.ip,
      body: req.body,
    });
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};

// ========================== CHANGE PASSWORD ==========================
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      await mailSender(
        updatedUserDetails.email,
        "Password Updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstname} ${updatedUserDetails.lastname}`
        )
      );
    } catch (emailErr) {
      return res.status(500).json({
        success: false,
        message: "Error sending email",
        error: emailErr.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password Change Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};
