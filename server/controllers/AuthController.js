// authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d' });
};

// Register user
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({ email, password });
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    res.status(200).json({
      _id: user._id,
      email: user.email,      
      firstName: user.firstName || "adarsh",
      lastName: user.lastName,
      image: user.image,
      color: user.color,
      profileSetup: user.profileSetup,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
   try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
    console.log("User profile fetched successfully:", user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id);
 if (req.file) {
      user.image = `/uploads/profile/${req.file.filename}`;
    }    console.log("Image path:", req.file.filename);
    
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.image =  user.image;
      user.color = req.body.color || user.color;
      user.profileSetup = true;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        image: updatedUser.image,
        color: updatedUser.color,
        profileSetup: updatedUser.profileSetup,
        token: generateToken(updatedUser._id)
      });
      
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
    .select("-password")
    .sort({ firstName: 1, lastName: 1, email: 1 });


    res.status(200).json({ contacts: users }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

