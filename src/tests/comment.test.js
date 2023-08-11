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
    await query("DELETE FROM comments WHERE comment_body = 'testComment'");
  });
  // Positive test case
  test("GET comments success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/posts/top-anime/comments");
    expect(result.statusCode).toEqual(200);
  });
  // Negative test case
  test("GET comments fail", async function () {
    const result = await authSession.get("/api/posts/top-anime/comments");
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
  // Negative test case
  test("GET comments fail, non-existent post", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession.get("/api/posts/top-manga/comments");
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toBe("uh-oh!");
  });
  // Positive test case
  test("INSERT comment success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1234",
    });
    const result = await authSession
      .post("/api/posts/top-anime/create-comment")
      .send({
        content: "testComment",
      });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("comment successfully inserted!");
  });
  // Negative test case
  // test("INSERT comment fail, non-existent post", async function () {
  //   await authSession.post("/api/login").send({
  //     identifier: "afi",
  //     password: "password1234",
  //   });
  //   const result = await authSession
  //     .post("/api/posts/top-manga/create-comment")
  //     .send({
  //       content: "testComment",
  //     });
  //   expect(result.statusCode).toEqual(400);
  //   expect(result.body.message).toBe("not found");
  // });
  // Negative test case
  test("INSERT comment fail, not authorized", async function () {
    const result = await authSession
      .post("/api/posts/top-anime/create-comment")
      .send({
        content: "testComment",
      });
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
});
