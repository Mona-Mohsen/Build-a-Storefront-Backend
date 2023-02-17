import supertest from "supertest";
import app from "../../server";
import orders from "../../types/orders";
import client from "../../database";

import orderModel from "../../models/orders";
import userModel from "../../models/users";

import users from "../../types/users";

const OrderModel = new orderModel();
const UserModel = new userModel();
const request = supertest(app);
let token = "";

describe("##Testing endpoint of Orders Model##", () => {
  const user = {
    username: "Admin",
    firstname: "Mona",
    lastname: "Mohsen",
    password: "P@ssw0rd",
  } as users;

  const order = {
    ostatus: "complete",
  } as orders;

  beforeAll(async () => {
    const createUser = await UserModel.createU(user);
    user.userid = createUser.userid;
    order.userid = createUser.userid;
    const creatOrder = await OrderModel.createO(order);
    order.orderid = creatOrder.orderid;
  });

  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM orders`;
    await conn.query(sql);
    const sql1 = `DELETE FROM users`;
    await conn.query(sql1);
    conn.release();
  });

  describe("Test Authentication Method", () => {
    it("should be able to authenticate to get token ", async () => {
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

    it("should be access denied  with wrong entries", async () => {
      const res = await request
        .post("/users/authenticate")
        .set("Content-type", "application/json")
        .send({ username: "xxxx", password: "yyy" });
      expect(res.status).toBe(401);
    });
  });

  describe("Testing CRUD Operation methods for orders model", () => {
    it("User add a new order", async () => {
      const res = await request
        .post("/orders/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userid: user.userid,
          ostatus: "Active",
        } as orders);
      expect(res.status).toBe(200);
      const { userid, ostatus } = res.body.data;
      expect(userid).toBe(user.userid);
      expect(ostatus).toBe("Active");
    });

    it("should get list of orders", async () => {
      const res = await request
        .get("/orders/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(2);
    });

    it("should return correct orders by id", async () => {
      const res = await request
        .get(`/orders/${order.orderid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.body.data.ostatus).toBe(order.ostatus);
      expect(res.body.data.orderid).toBe(order.orderid);
      expect(res.body.data.userid).toBe(order.userid);
    });

    it("should update an order", async () => {
      const res = await request
        .patch(`/orders/${order.orderid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...order,
          ostatus: "Active",
        });
      expect(res.status).toBe(200);
      const { orderid, userid, ostatus } = res.body.data.order;
      expect(orderid).toBe(order.orderid);
      expect(userid).toBe(order.userid);
      expect(ostatus).toBe("Active");
    });

    it("should delete one of orders", async () => {
      const res = await request
        .delete(`/orders/${order.orderid}/`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.orderid).toBe(order.orderid);
      expect(res.body.data.userid).toBe(order.userid);
      expect(res.body.data.ostatus).toBe("Active");

      const res1 = await request
        .get("/orders/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res1.status).toBe(200);
      expect(Object.keys(res1.body.data).length).toBe(1);
    });
  });
});
