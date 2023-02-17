import client from "../../database";
import userModel from "../users";
import users from "../../types/users";

const UserModel = new userModel();

describe("User Model Unit Testing", () => {
  describe("Testing the defined methods", () => {
    it("should have Create  method", () => {
      expect(UserModel.createU).toBeDefined();
    });

    it("should have index method", () => {
      expect(UserModel.indexU).toBeDefined();
    });

    it("should have show method", () => {
      expect(UserModel.showU).toBeDefined();
    });

    it("should have update method", () => {
      expect(UserModel.updateU).toBeDefined();
    });

    it("should have delete method", () => {
      expect(UserModel.deleteU).toBeDefined();
    });

    it("should have authenticattion method", () => {
      expect(UserModel.authenticate).toBeDefined();
    });
  });
  describe("Testing the CRUD operation of the user Model", () => {
    const user = {
      username: "admin",
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

    it("index method should return all users", async () => {
      const users = await UserModel.indexU();
      expect(users.length).toBe(1);
    });

    it("Create method should add new user", async () => {
      const user = {
        username: "Memo",
        firstname: "Mona",
        lastname: "Mohsen",
        password: "P@ssw0rd",
      } as users;
      const createUser = await UserModel.createU(user);
      user.userid = createUser.userid;
      expect(createUser.userid).toBe(user.userid);
      expect(createUser.username).toBe(user.username);
      expect(createUser.firstname).toBe(user.firstname);
      expect(createUser.lastname).toBe(user.lastname);
    });

    it("show method should returned the correct user by id", async () => {
      const oneUser = await UserModel.showU(user.userid);
      expect(oneUser.userid).toBe(user.userid);
      expect(oneUser.username).toBe(user.username);
      expect(oneUser.firstname).toBe(user.firstname);
      expect(oneUser.lastname).toBe(user.lastname);
    });
    it("update method should return the updated user", async () => {
      const updatedUser = await UserModel.updateU({
        ...user,
        firstname: "Nada",
        lastname: "Saad",
      });
      expect(updatedUser.userid).toBe(user.userid);
      expect(updatedUser.username).toBe(user.username);
      expect(updatedUser.firstname).toBe("Nada");
      expect(updatedUser.lastname).toBe("Saad");
    });
    it("delete method should remove user", async () => {
      const deleteUser = await UserModel.deleteU(user.userid as string);
      expect(deleteUser.userid).toBe(user.userid);
      const users = await UserModel.indexU();
      expect(users.length).toBe(1);
    });
  });
  describe("Testing the user authentication using usernam an password", () => {
    const user = {
      username: "Memo",
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
    it("Authenticate method should return the authenticated user data", async () => {
      const authenticatedUser: users | null = await UserModel.authenticate(
        user.username,
        user.password
      );
      expect(authenticatedUser?.username).toBe(user.username);
      expect(authenticatedUser?.firstname).toBe(user.firstname);
      expect(authenticatedUser?.lastname).toBe(user.lastname);
    });
    it("Authenticate method should return nothing for wrong entries", async () => {
      const authenticatedUser = await UserModel.authenticate("xxxxx", "yyyyy");
      expect(authenticatedUser).toBe(null);
    });
  });
});
