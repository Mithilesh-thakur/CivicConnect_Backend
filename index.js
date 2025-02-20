require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
