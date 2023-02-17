import supertest from "supertest";
import app from "../server";

const request = supertest(app);

describe("Test homepage endpoint server", () => {
  it("return homepage endoint", async () => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
  });
});
