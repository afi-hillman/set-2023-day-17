import app from "../app";
import supertest from "supertest";
import session from "supertest-session";
import query from "../database";

describe("test auth controller", function () {
  let authSession;
  beforeEach(async function () {
    authSession = session(app);
  });
  afterAll(async function () {
    await query("DELETE FROM users WHERE username = 'testUsername'");
  });
  // Positive test case
  test("LOGIN correct identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Login successful!");
  });
  // Negative test case
  test("LOGIN wrong identifier", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "wrongidentifier123",
      password: "password1234",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toBe("login unsuccessful!");
  });
  // Negative test case
  test("LOGIN wrong password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "afi",
      password: "wrongpassword123",
    });
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("login unsuccessful");
  });
  // Positive test case
  test("REGISTER success", async function () {
    const result = await supertest(app).post("/api/register").send({
      email: "test@mail.com",
      username: "testUsername",
      password: "testPassword",
      is_admin: "true",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("user created");
  });
  // Negative test case
  test("REGISTER fail", async function () {
    const result = await supertest(app).post("/api/register").send({
      email: "afi@mail.com",
      username: "testUsername2",
      password: "testPassword",
      is_admin: "false",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toBe("Username or email already exists.");
  });
  // Positive test case
  test("LOGOUT success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/logout");
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("logout successful!");
  });
  // Negative test case
  test("LOGOUT fail", async function () {
    const result = await authSession.get("/api/logout");
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
});
