import orderModel from "../orders";
import userModel from "../users";

import client from "../../database";

import orders from "../../types/orders";
import users from "../../types/users";

const UserModel = new userModel();
const OrderModel = new orderModel();

describe("Orders Model Unit Testing", () => {
  describe("Testing the defined methods", () => {
    it("should have a Create method", () => {
      expect(OrderModel.createO).toBeDefined();
    });

    it("should have index method", () => {
      expect(OrderModel.indexO).toBeDefined();
    });

    it("should have show method", () => {
      expect(OrderModel.showO).toBeDefined();
    });

    it("should have a update method", () => {
      expect(OrderModel.updateO).toBeDefined();
    });

    it("should have a delete order method", () => {
      expect(OrderModel.deleteO).toBeDefined();
    });
  });
  describe("Testing the CRUD operation of the orders Model", () => {
    const user = {
      username: "Memo",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",
    } as users;

    const order = {
      ostatus: "Active",
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

    it("should add a new order", async () => {
      const creatOrder = await OrderModel.createO({
        ...order,
        userid: user.userid,
      });
      order.orderid = creatOrder.orderid;
      expect(creatOrder.orderid).toBe(order.orderid);
      expect(creatOrder.ostatus).toBe(order.ostatus);
      expect(creatOrder.userid).toBe(order.userid);
    });

    it("Index method Should return all orders", async () => {
      const orders = await OrderModel.indexO();
      expect(orders.length).toBe(2);
    });

    it("show method should return correct order", async () => {
      const oneOrder = await OrderModel.showO(order.orderid);
      expect(oneOrder.orderid).toBe(order.orderid);
      expect(oneOrder.ostatus).toBe(order.ostatus);
      expect(oneOrder.userid).toBe(order.userid);
    });

    it("update method should return the updated order", async () => {
      const updatedOrder = await OrderModel.updateO({
        ...order,
        ostatus: "Complete",
      });
      expect(updatedOrder.orderid).toBe(order.orderid);
      expect(updatedOrder.ostatus).toBe("Complete");
      expect(updatedOrder.userid).toBe(order.userid);
    });

    it("delete method should remove the order", async () => {
      const deleteOrder = await OrderModel.deleteO(order.orderid as string);
      expect(deleteOrder.orderid).toBe(order.orderid);
      const orders = await OrderModel.indexO();
      expect(orders.length).toBe(1);
    });
  });
});
