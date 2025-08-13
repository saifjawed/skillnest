const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Incoming Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT Decoded:", decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Student'){
            return res.status(401).json({
                success:false,
                message:'this is the proctected route for Student only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again',
        });
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Instructor'){
            return res.status(401).json({
                success:false,
                message:'this is the proctected route for Instructor only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Instructor role cannot be verified, please try again',
        });
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Admin'){
            return res.status(401).json({
                success:false,
                message:'this is the proctected route for Admin only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Admin role cannot be verified, please try again',
        });
    }
}