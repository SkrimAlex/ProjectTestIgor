require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server"); // Імпортуємо сервер
const User = require("./models/User");
const Bug = require("./models/BugSchema");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Bug.deleteMany({});
  await mongoose.connection.close();
});

// Тест реєстрації користувача
describe("User Authentication", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "TestPassword123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should not register an existing user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "TestPassword123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "TestPassword123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("user");
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});

// Тест для баг-трекера
describe("Bug Tracker API", () => {
  it("should create a new bug", async () => {
    const res = await request(app).post("/api/bugs").send({
      title: "Test Bug",
      description: "This is a test bug",
      priority: "High",
      status: "Open",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Bug created successfully");
    expect(res.body).toHaveProperty("bugId");
  });

  it("should fetch all bugs", async () => {
    const res = await request(app).get("/api");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
