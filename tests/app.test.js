const request = require("supertest");
const app = require("../app");
const redisClient = require("../db/redis-client");

beforeAll(async () => {
  server = app.listen(3001);
  await redisClient.connect();
});

afterAll(async () => {
  server.close();
  await redisClient.quit();
});

describe("GET /", () => {
  it("should render home page with correct title", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Hello");
  });
});
