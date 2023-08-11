import app from "../app";
import supertest from "supertest";
import session from "supertest-session";
import query from "../database";

describe("test content (post) controller", function () {
  let authSession;
  beforeEach(async function () {
    authSession = session(app);
  });
  afterAll(async function () {
    await query("DELETE FROM posts WHERE slug = 'mabu'");
  });
  // Positive test case
  test("GET ALL posts success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/posts");
    expect(result.statusCode).toEqual(200);
  });
  // Negative test case
  test("GET ALL posts fail", async function () {
    const result = await authSession.get("/api/posts");
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
  // Positive test case
  test("GET SINGLE post success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/posts/top-anime");
    expect(result.statusCode).toEqual(200);
  });
  // NEGATIVE test case
  test("GET SINGLE post fail, non-existent", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/posts/top-manga");
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toBe("post not found");
  });
  // NEGATIVE test case
  test("GET SINGLE post fail, unauthorized", async function () {
    const result = await authSession.get("/api/posts/top-anime");
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
  // POSITIVE test case
  test("CREATE NEW POST success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.post("/api/create-post").send({
      title: "rich scholar",
      content:
        "got the city shook i make top dollar like im a white collar crook keep a white collar, black forces on my foot",
      slug: "mabu",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("post insertion successful!");
  });
  // NEGATIVE test case
  test("CREATE NEW POST fail", async function () {
    const result = await authSession.post("/api/create-post").send({
      title: "rich scholar",
      content:
        "got the city shook i make top dollar like im a white collar crook keep a white collar, black forces on my foot",
      slug: "mabu",
    });
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
});
