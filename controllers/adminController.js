const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Signup Controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin signed up successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get Admin Details Controller
exports.getAdminDetails = async (req, res) => {
  const { adminId } = req.params; // Assuming adminId is passed as a URL parameter

  try {
    // Find admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return admin details (excluding password)
    const { password, ...adminDetails } = admin._doc; // Exclude password from the response
    res.status(200).json(adminDetails);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};