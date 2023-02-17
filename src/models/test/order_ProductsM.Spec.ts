import client from "../../database";

import userModel from "../users";
import productModel from "../products";
import orderModel from "../orders";
import order_productsModel from "../order_products";

import users from "../../types/users";
import products from "../../types/products";
import orders from "../../types/orders";
import order_products from "../../types/order_products";

const UserModel = new userModel();
const OrderModel = new orderModel();
const ProductModel = new productModel();
const ProdOrderModel = new order_productsModel();

describe("orders Products Unit Testing", () => {
  describe("Testing the defined methods", () => {
    it("should have Create methode", () => {
      expect(ProdOrderModel.create).toBeDefined();
    });

    it("should have index methode", () => {
      expect(ProdOrderModel.index).toBeDefined();
    });

    it("should have show methode", () => {
      expect(ProdOrderModel.show).toBeDefined();
    });

    it("should have update methode", () => {
      expect(ProdOrderModel.update).toBeDefined();
    });

    it("should have delete methode", () => {
      expect(ProdOrderModel.delete).toBeDefined();
    });
  });

  describe("Testing the CRUD operation of the orders products Models", () => {
    const user = {
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",
    } as users;

    const product = {
      pname: "Labtop",
      price: "2000",
    } as products;

    const order = {
      ostatus: "Active",
    } as orders;

    const product_order = {
      quantity: 10,
    } as order_products;

    beforeAll(async () => {
      const createdUser = await UserModel.createU(user);
      user.userid = createdUser.userid;
      const creatProduct = await ProductModel.createP(product);
      product.productid = creatProduct.productid;
      order.userid = createdUser.userid;
      const creatOrder = await OrderModel.createO(order);
      order.orderid = creatOrder.orderid;
      product_order.productid = creatProduct.productid;
      product_order.orderid = creatOrder.orderid;
      const createorderProduct = await ProdOrderModel.create(product_order);
      product_order.orderproductid = createorderProduct.orderproductid;
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

    it("Create new products order should add the new ordered products", async () => {
      const createorderProduct = await ProdOrderModel.create(product_order);
      product_order.orderproductid = createorderProduct.orderproductid;
      expect(createorderProduct.productid).toBe(product_order.productid);
      expect(createorderProduct.orderid).toBe(product_order.orderid);
      expect(createorderProduct.quantity).toBe(product_order.quantity);
    });

    it("index method should return all orders poducts", async () => {
      const orderProducts = await ProdOrderModel.index();
      expect(orderProducts.length).toBe(2);
    });

    it("show method should return correct oreders products", async () => {
      const orderProducts = await ProdOrderModel.show(
        product_order.orderproductid
      );
      expect(orderProducts.orderproductid).toBe(product_order.orderproductid);
      expect(orderProducts.productid).toBe(product_order.productid);
      expect(orderProducts.orderid).toBe(product_order.orderid);
      expect(orderProducts.quantity).toBe(product_order.quantity);
    });

    it("update method should return the updated orders product", async () => {
      const updatedorderProd = await ProdOrderModel.update({
        ...product_order,
        quantity: 20,
      });
      expect(updatedorderProd.orderproductid).toBe(
        product_order.orderproductid
      );
      expect(updatedorderProd.quantity).toBe(20);
      expect(updatedorderProd.productid).toBe(product_order.productid);
      expect(updatedorderProd.orderid).toBe(product_order.orderid);
    });

    it("delete method should remove ordrs products", async () => {
      const deleteOrdprod = await ProdOrderModel.delete(
        product_order.orderproductid
      );
      expect(deleteOrdprod.orderproductid).toBe(product_order.orderproductid);
      const orderProducts = await OrderModel.indexO();
      expect(orderProducts.length).toBe(1);
    });
  });
});
