require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User"); // Додай цей рядок
const Bug = require("./models/BugSchema"); 
const bcrypt = require("bcrypt");
const bugRoutes = require("./routes/bugRoutes")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Куди зберігати файли

const authRoutes = require("./routes/auth");


const app = express();

app.use(express.json());
app.use(cors());

console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/auth", authRoutes);


app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Перевірка, чи існує вже користувач
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Хешування пароля перед збереженням
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Створення нового користувача
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Перевірка, чи існує користувач
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Перевірка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});














app.use("/api", bugRoutes);

// Створення нового багу
app.post("/", async (req, res) => {
    try {
      const bug = new Bug(req.body);
      await bug.save();
      res.status(201).json(bug);
    } catch (error) {
      res.status(400).json({ message: "Error creating bug" });
    }
  });
  
  // Отримання багів із фільтрацією
  app.get("/", async (req, res) => {
    const filters = req.query;
    try {
      const bugs = await Bug.find(filters);
      res.json(bugs);
    } catch (error) {
      res.status(400).json({ message: "Error fetching bugs" });
    }
  });
  
  // Оновлення статусу багу
  app.patch("/:id", async (req, res) => {
    try {
      const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(bug);
    } catch (error) {
      res.status(400).json({ message: "Error updating bug" });
    }
  });

  // Використовуємо upload.single('file'), щоб обробити один файл
  app.post('/api/bugs', upload.single('file'), async (req, res) => {
    console.log(req.body); // Перевірте, чи є title та description у запиті
    
    const { title, description, priority, status, assignedTo, labels, comments } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required!' });
    }
    
    const file = req.file ? req.file.path : null;
    
    try {
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
  });
  




const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;