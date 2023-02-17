import supertest from "supertest";
import app from "../../server";
import users from "../../types/users";
import client from "../../database";
import userModel from "../../models/users";

const UserModel = new userModel();
const request = supertest(app);
let token = "";

describe("Test endpoint of user model", () => {
  const user = {
    username: "Admin",
    firstname: "Mona",
    lastname: "Mohsen",
    password: "P@ssw0rd",
  } as users;

  beforeAll(async () => {
    const createUser = await UserModel.createU(user);
    user.userid = createUser.userid;
  });

  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM users`;
    await conn.query(sql);
    conn.release();
  });

  describe("Test Authentication Method", () => {
    it("should get token when user is authenticated", async () => {
      const res = await request
        .post("/users/authenticate")
        .set("Content-type", "application/json")
        .send({ username: "Admin", password: "P@ssw0rd" });
      expect(res.status).toBe(200);
      const {
        userid,
        username,
        firstname,
        lastname,
        token: userToken,
      } = res.body.data;
      expect(userid).toBe(user.userid);
      expect(username).toBe(user.username);
      expect(firstname).toBe(user.firstname);
      expect(lastname).toBe(user.lastname);
      token = userToken;
    });

    it("should access denied with wrong data", async () => {
      const res = await request
        .post("/users/authenticate")
        .set("Content-type", "application/json")
        .send({ username: "xxxx", password: "yyyy" });
      expect(res.status).toBe(401);
    });
  });
  describe("Testing CRUD Operation methods for USER MODEL", () => {
    it("Add new user", async () => {
      const res = await request
        .post("/users/")
        .set("Content-type", "application/json")
        .send({
          username: "Admin2",
          firstname: "Mona",
          lastname: "Mohsen",
          password: "P@ssw0rd",
        } as users);
      expect(res.status).toBe(200);
      const { username, firstname, lastname } = res.body.data.user;
      expect(username).toBe("Admin2");
      expect(firstname).toBe("Mona");
      expect(lastname).toBe("Mohsen");
    });

    it("should get list of users", async () => {
      const res = await request
        .get("/users/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.users.length).toBe(2);
    });

    it("should get correct user by id", async () => {
      const res = await request
        .get(`/users/${user.userid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      const { userid, username, firstname, lastname } = res.body.data.user;
      expect(userid).toBe(user.userid);
      expect(username).toBe("Admin");
      expect(firstname).toBe("Mona");
      expect(lastname).toBe("Mohsen");
    });

    it("should update a user", async () => {
      const res = await request
        .patch(`/users/${user.userid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...user,
          username: "Admin",
          firstname: "Mona",
          lastname: "Mohsen",
        });
      expect(res.status).toBe(200);
      const { userid, username, firstname, lastname } = res.body.data.user;
      expect(userid).toBe(user.userid);
      expect(username).toBe("Admin");
      expect(firstname).toBe("Mona");
      expect(lastname).toBe("Mohsen");
    });

    it("should delete a user", async () => {
      const res = await request
        .delete(`/users/${user.userid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.userid).toBe(user.userid);
      expect(res.body.data.username).toBe("Admin");
    });
  });
});
