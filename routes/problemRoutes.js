const express = require("express");
const multer = require("multer");
const path = require("path");
const problemController = require("../controllers/problemController");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("image"), problemController.uploadProblem);
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);
router.delete("/:id", problemController.deleteProblem);

module.exports = router;  