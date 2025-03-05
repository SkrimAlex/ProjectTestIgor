const mongoose = require("mongoose");


const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  assignedTo: String,
  labels: [String],
  comments: String,
  file: String
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
