const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    pattern: {
        type: String,
        required: true,
    },
    direction: {
        type: String,
        enum: ['in', 'out'],  // Assuming 'in' or 'out' values for direction
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now,
    }
});

// Create a model from the schema
const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;
