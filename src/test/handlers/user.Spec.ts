import supertest from "supertest";
import app from "../../server";
import {users} from "../../types/types";
import client from "../../database";
import UserStore from "../../models/users";
import * as  query  from "../../query/users";

const userStore = new UserStore();
const request = supertest(app);
let user_id:string;
let token = "Token";

describe("Test API endpoints of User", () => {
 
  beforeAll(async () => {
    //create user
    const newUser = await userStore.createU({
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",  
    } as users);

    user_id=newUser.userid;
  })

  it("Authenticate routes should return user data with token if user authorized", async () => {
    const res = await request
      .post("/users/authenticate")
      .send({ username: "Admin", password: "P@ssw0rd" })
      token=res.body.token

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      userid:user_id,
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      token:token
    })
  })
  
  it("POST authenticate should return Null if not authorized users", async () => {
    const res = await request
      .post("/users/authenticate")
      .send({ username: "xxx", password: "yyy" });

    expect(res.status).toBe(401);
  });

  it("GET users should get list of users", async () => {
    const res = await request
    .get("/users/")
    .set("Authorization", `Bearer `+ token);
      
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{
      userid:user_id,
      username:"Admin",
      firstname: 'Mona',
      lastname: 'Mohsen',
     }]);
  });

  it("GET user by id should return correct user", async () => {
    const res = await request
    .get(`/users/${user_id}/`)
    .set("Authorization", `Bearer `+ token)

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      userid:user_id,
      username:"Admin",
      firstname: 'Mona',
      lastname: 'Mohsen',
      });
    });

    it("PATCH user by id should update a user", async () => {
      const res = await request
        .patch(`/users/${user_id}/`)
        .set("Authorization", `Bearer `+ token)
        .send({userid:user_id,username: "Admin2",firstname: "Mona",lastname: "Mohsen", });
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        userid:user_id,
        username: "Admin2",
        firstname: "Mona",
        lastname: "Mohsen",
      });
    });

    it("POST user should add a new user", async () => {
      const res = await request
        .post("/users/")
        .send({username: "Admin3", firstname: "Nada",lastname: "Saad", password: "P@ssw0rd",})
  
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        userid:res.body.userid,
        username: "Admin3", 
        firstname: "Nada",
        lastname: "Saad"
      });
    });

    it("DELETE user by id should delete a user", async () => {
      const res = await request
        .delete(`/users/${user_id}/`)
        .set("Authorization", `Bearer `+ token)
       
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        userid:user_id,
        username: "Admin2",
        firstname: "Mona",
        lastname: "Mohsen",
      });
    });

    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(query.deleteuser);
      conn.release();
    });
 
});
