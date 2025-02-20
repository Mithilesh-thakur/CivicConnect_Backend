const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
    problem_name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    latitude:{type:Number,require:true},
    longitude:{type:Number,require:true},
    image: { type: String, required: true }, // Image path
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Problem", ProblemSchema);