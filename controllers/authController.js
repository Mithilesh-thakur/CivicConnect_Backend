const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword });

        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
