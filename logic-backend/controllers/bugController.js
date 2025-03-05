const Bug = require('../models/BugSchema'); // Шлях має відповідати реальному розташуванню файлу

exports.createBug = async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo, labels, comments } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required!' });
    }

    const file = req.file ? req.file.path : null;

    const newBug = new Bug({
      title,
      description,
      priority,
      status,
      assignedTo,
      labels,
      comments,
      file
    });

    await newBug.save();
    res.status(201).json({ message: 'Bug created successfully', bugId: newBug._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bug', error });
  }
};
