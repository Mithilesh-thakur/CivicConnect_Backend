const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Signup Route
router.post('/signup', adminController.signup);

// Login Route
router.post('/login', adminController.login);

// Get Admin Details Route
router.get('/details/:adminId', adminController.getAdminDetails); // New route for getting admin details

module.exports = router;