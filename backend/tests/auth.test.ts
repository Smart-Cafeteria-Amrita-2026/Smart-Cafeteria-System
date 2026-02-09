import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/authRoutes";
import { service_client, public_client } from "../src/config/supabase";

jest.mock("../src/config/supabase");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register a user successfully (Valid Case 1)", async () => {
      const userData = {
        email: "test@gmail.com",
        password: "Password123!",
        first_name: "John",
        last_name: "Doe",
        college_id: "CB.EN.U4CSE21000",
        role: "user"
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(service_client.auth.admin.createUser).toHaveBeenCalled();
    });

    it("should return 400 for invalid email format (Invalid Case 1)", async () => {
      const userData = {
        email: "invalid-email",
        password: "Password123!",
        first_name: "John",
        last_name: "Doe",
        college_id: "CB.EN.U4CSE21000",
        role: "user"
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Validation Error");
    });

    it("should return 400 for weak password (Invalid Case 2)", async () => {
      const userData = {
        email: "test@gmail.com",
        password: "weak",
        first_name: "John",
        last_name: "Doe",
        college_id: "CB.EN.U4CSE21000",
        role: "user"
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Validation Error");
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully (Valid Case 2)", async () => {
      const credentials = {
        email: "test@gmail.com",
        password: "Password123!"
      };

      const res = await request(app)
        .post("/auth/login")
        .send(credentials);

      expect(res.status).toBe(202);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(public_client.auth.signInWithPassword).toHaveBeenCalled();
    });

    it("should return 400 for missing password (Invalid Case 3)", async () => {
      const credentials = {
        email: "test@gmail.com"
      };

      const res = await request(app)
        .post("/auth/login")
        .send(credentials);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Validation Error");
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout successfully (Valid Case 3)", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Cookie", ["access_token=valid-token"]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should send password reset link for valid email (Valid Case 4)", async () => {
      const res = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "test@gmail.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("password reset link has been sent");
      expect(service_client.auth.resetPasswordForEmail).toHaveBeenCalled();
    });

    it("should return 400 for invalid email format (Invalid Case 4)", async () => {
      const res = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Validation Error");
    });
  });

  describe("POST /auth/reset-password", () => {
    it("should update password successfully with valid token (Valid Case 5)", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .set("Authorization", "Bearer valid-token")
        .send({ password: "NewPassword123!" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password updated successfully");
      expect(service_client.auth.admin.updateUserById).toHaveBeenCalled();
    });

    it("should return 401 for missing authentication token (Invalid Case 5)", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .send({ password: "NewPassword123!" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid authentication token");
    });
  });
});
