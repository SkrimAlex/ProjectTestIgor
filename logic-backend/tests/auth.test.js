const request = require("supertest");
const app = require("../server"); // імпорт головного файлу серверу
const mongoose = require("mongoose");
const User = require("../models/User"); // імпорт моделі користувача

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    await User.deleteMany({}); // Очищаємо базу перед тестами
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Закриваємо підключення після тестів
  });

  const testUser = {
    email: "testuser@example.com",
    password: "Test@1234"
  };

  let token = "";

  test("1. Успішна реєстрація нового користувача", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("2. Неможливість зареєструвати користувача з існуючим email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("3. Успішний вхід у систему після реєстрації", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(testUser);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // Зберігаємо токен для наступного тесту
  });

  test("4. Неможливість входу з невірним паролем", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "WrongPass123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("5. Перехід на Dashboard після входу", async () => {
    const res = await request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Welcome to the dashboard");
  });
});
