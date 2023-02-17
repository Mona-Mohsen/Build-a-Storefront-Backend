import client from "../../database";
import supertest from "supertest";
import app from "../../server";

import userModel from "../../models/users";
import productModel from "../../models/products";
import orderModel from "../../models/orders";
import order_productsModel from "../../models/order_products";

import users from "../../types/users";
import products from "../../types/products";
import orders from "../../types/orders";
import order_products from "../../types/order_products";

const UserModel = new userModel();
const ProductModel = new productModel();
const OrderModel = new orderModel();
const ProdOrderModel = new order_productsModel();

const request = supertest(app);
let token = "";

describe("Testing the end point of order products methods", () => {
  const user = {
    username: "Admin",
    firstname: "Mona",
    lastname: "Mohsen",
    password: "P@ssw0rd",
  } as users;

  const product = {
    pname: "PC",
    price: "3000",
  } as products;

  const order = {
    ostatus: "complete",
  } as orders;

  const product_order = {
    quantity: 1,
  } as order_products;

  beforeAll(async () => {
    const createUser = await UserModel.createU(user);
    user.userid = createUser.userid;
    order.userid = createUser.userid;

    const creatProduct = await ProductModel.createP(product);
    product.productid = creatProduct.productid;
    product_order.productid = creatProduct.productid;

    const creatOrder = await OrderModel.createO(order);
    order.orderid = creatOrder.orderid;

    product_order.orderid = creatOrder.orderid;
    const createProdOrd = await ProdOrderModel.create(product_order);
    product_order.orderproductid = createProdOrd.orderproductid;
  });

  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM order_products`;
    await conn.query(sql);
    const sql1 = `DELETE FROM orders`;
    await conn.query(sql1);
    const sql2 = `DELETE FROM products`;
    await conn.query(sql2);
    const sql3 = `DELETE FROM users`;
    await conn.query(sql3);
    conn.release();
  });

  describe("Test Authentication Method", () => {
    it("should get token if  authorized", async () => {
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

    it("should be failed to authenticated with wrong entries", async () => {
      const res = await request
        .post("/users/authenticate")
        .set("Content-type", "application/json")
        .send({ username: "xxxx", password: "yyyy" });
      expect(res.status).toBe(401);
    });
  });
  describe("Testing CRUD Operation methods for order products model", () => {
    it("User add order products", async () => {
      const res = await request
        .post("/orderProducts/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          productid: product.productid,
          orderid: order.orderid,
          quantity: 1,
        } as order_products);
      expect(res.status).toBe(200);
      const { productid, orderid, quantity } = res.body.data;
      expect(productid).toBe(product_order.productid);
      expect(orderid).toBe(product_order.orderid);
      expect(quantity).toBe(product_order.quantity);
    });

    it("should get list of order products", async () => {
      const res = await request
        .get("/orderProducts/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(2);
    });

    it("should return correct order product using Id", async () => {
      const res = await request
        .get(`/orderProducts/${product_order.orderproductid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.body.data.orderproductid).toBe(product_order.orderproductid);
      expect(res.body.data.orderid).toBe(product_order.orderid);
      expect(res.body.data.productid).toBe(product_order.productid);
      expect(res.body.data.quantity).toBe(product_order.quantity);
    });

    it("should update an order products", async () => {
      const res = await request
        .patch(`/orderProducts/${product_order.orderproductid}`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...product_order,
          quantity: 1,
        });
      expect(res.status).toBe(200);
      const { orderproductid, orderid, productid, quantity } =
        res.body.data.orderProducts;
      expect(orderproductid).toBe(product_order.orderproductid);
      expect(orderid).toBe(product_order.orderid);
      expect(productid).toBe(product_order.productid);
      expect(quantity).toBe(1);
    });

    it("should remove order product", async () => {
      const res = await request
        .delete(`/orderProducts/${product_order.orderproductid}/`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.orderid).toBe(product_order.orderid);
      expect(res.body.data.orderproductid).toBe(product_order.orderproductid);
      expect(res.body.data.productid).toBe(product_order.productid);
      expect(res.body.data.quantity).toBe(1);

      const res1 = await request
        .get("/orderProducts/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res1.status).toBe(200);
      expect(Object.keys(res1.body.data).length).toBe(1);
    });
  });
});
