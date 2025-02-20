const Problem = require("../models/Problem");
const fs = require("fs");
const path = require("path");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload problem report
exports.uploadProblem = async (req, res) => {
  try {
    const { problem_name, description, location, latitude, longitude } = req.body;

    // Validate required fields
    if (!problem_name || !description || !location || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Construct image URL
    const imageUrl = `http://192.168.115.183:3000/uploads/${req.file.filename}`;

    const newProblem = new Problem({
      problem_name,
      description,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image: req.file.filename, // Store only filename
      image_url: imageUrl, // Store full URL
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem reported successfully", data: newProblem });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });

    const problemsWithImageUrl = problems.map(problem => ({
      ...problem._doc,
      image_url: `http://192.168.115.183:3000/uploads/${problem.image}`,
    }));

    res.status(200).json(problemsWithImageUrl);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

// Get a single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json({
      ...problem._doc,
      image_url: `http://localhost:3000/uploads/${problem.image}`,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Error fetching problem details" });
  }
};

// Delete a problem (also removes the image)
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Delete image file if it exists
    const imagePath = path.join(uploadDir, problem.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete problem" });
  }
}; 