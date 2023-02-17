import client from "../../database";
import UserStore from "../../models/users";
import {users} from "../../types/types";
import * as query from "../../query/users"
const userStore = new UserStore();

describe("User Model Test", () => {

  let user_id:string;

  beforeAll(async () => {
    const newUser = await userStore.createU({
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",  
    } as users);
    user_id=newUser.userid;
  });

  it("should have a Create method", () => {
    expect(userStore.createU).toBeDefined();
  });

  it("should have an index method", () => {
    expect(userStore.indexU).toBeDefined();
  });

  it("should have a show method", () => {
    expect(userStore.showU).toBeDefined();
  });

  it("should have an update method", () => {
    expect(userStore.updateU).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(userStore.deleteU).toBeDefined();
  });

  it("should have an authenticattion method", () => {
    expect(userStore.authenticate).toBeDefined();
  });

  it("index method should return all users", async () => {
    const result = await userStore.indexU()

    expect(result.length).toEqual(1)
    
    expect(result).toEqual([{
      userid: user_id,
      username: "Admin",
      firstname: "Mona",
      lastname:"Mohsen",
    } as users] );
  });

  it("show method should return correct user by id", async () => {
    const result = await userStore.showU(user_id);
    expect(result).toEqual({
      username: "Admin",
      firstname: "Mona",
      lastname:"Mohsen",
      userid: user_id,
    } as users);
  });

  it("Create method should add new user", async () => {
    
    const result = await userStore.createU({
      username: "Admin2",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd"
   } as users)

    user_id = result.userid

    expect(result).toEqual({
      userid: user_id,
      username: "Admin2",
      firstname: "Mona",
      lastname:"Mohsen"
    } as users);
  });

  it("Authenticate method should return the authenticated user data", async () => {
    const result: users | null = await userStore.authenticate("Admin","P@ssw0rd");
    
    expect(result).toEqual({
    userid:result?.userid,
    username: "Admin",
    firstname: "Mona",
    lastname:"Mohsen"
    }as users)
  });

  it("Authenticate method should return nothing for wrong entries", async () => {
    const authenticatedUser = await userStore.authenticate("xxxxx", "yyyyy");
    expect(authenticatedUser).toEqual(null);
  });

  it("update method should return the updated user", async () => {
    const result = await userStore.updateU({
      userid:user_id,
      username: "Admin2",
      firstname: "Nada",
      lastname: "SAAD",
      password: "P@ssw0rd"
   } as users)

   expect(result).toEqual({
    userid: result.userid,
    username: "Admin2",
    firstname: "Nada",
    lastname: "SAAD",
  } as users);
});

  it("delete method should remove user", async () => {
    const result = await userStore.deleteU(user_id)

    expect(result).toEqual({
      userid: user_id,
      username: "Admin2",
      firstname: "Nada",
      lastname: "SAAD",
    } as users);

    const result2 = await userStore.indexU();
    expect(result2.length).toBe(1);
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(query.deleteuser);
    conn.release();
  });
     
});
