import client from "../../database";
import supertest from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import * as queryu from "../../query/users";
import * as queryp from "../../query/products";
import * as queryo from "../../query/orders";
import * as query from "../../query/order_products";

import UserStore from "../../models/users";
import ProductStore from "../../models/products";
import orderModel from "../../models/orders";
import OrderProductStore from "../../models/order_products";

import  {users, products, orders,order_products}from "../../types/types";

dotenv.config();
const { TOKEN_SECRET } = process.env;

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new orderModel();
const orderProductStore = new OrderProductStore();

const request = supertest(app);

let user_id:string;
let pro_id:string;
let order_id:string;
let orderproduct_id:string;
let token = "Token";

describe("Test API endpoints of order product", () => {
 
  beforeAll(async () => {

    //create user
    const newUser = await userStore.createU({
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",  
    } as users);
    user_id=newUser.userid;

    const user = await userStore.authenticate(newUser.username, newUser.password);
    token = jwt.sign({ user }, TOKEN_SECRET as string); 

    //create product
    const createproduct = await productStore.createP({
      pname: 'PC',
      price: 3000
     } as products);
      pro_id= createproduct.productid 

    //create order
    const neworder = await orderStore.createO({
      ostatus: "open",
      userid: user_id
    } as orders);
    order_id= neworder.orderid

    //create order product
    const neworderproduct = await orderProductStore.create({
      productid: pro_id,
      orderid: order_id,
      quantity:10
    } as order_products);
    orderproduct_id= neworderproduct.orderproductid 
  });

  
it("GET order product by id should return correct order product", async () => {
  const res = await request.get("/orderProducts/"+ orderproduct_id +"/")
  .set("Authorization", `Bearer ${token}`)

  expect(res.status).toBe(200);
  expect(res.body).toEqual({
    orderproductid:orderproduct_id,
    productid: pro_id,
    orderid: order_id,
    quantity:10
    });
  });


  it("PATCH order product by id should update an order product", async () => {
    const res = await request
      .patch("/orderProducts/"+ orderproduct_id +"/")
      .set("Authorization", `Bearer `+ token)
      .send({orderproductid:orderproduct_id,orderid:order_id,productid:pro_id,quantity: 20});
  
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      orderproductid:orderproduct_id,
      productid: pro_id,
      orderid: order_id,
      quantity:20
    });
  });


    it("POST order product should add a new order product", async () => {
      const res = await request
        .post("/orderProducts/")
        .set("Authorization", `Bearer `+ token)
        .send({productid: pro_id,orderid:order_id,quantity:3});
    
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
       orderproductid:res.body.orderproductid,
       productid: pro_id,
       orderid: order_id,
       quantity:3

      });
    }); 

    it("DELETE order product by id should delete an oder products", async () => {
      const res = await request
        .delete("/orderProducts/"+ orderproduct_id +"/")
        .set("Authorization", `Bearer `+ token)
    
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        orderproductid:orderproduct_id,
        productid: pro_id,
        orderid: order_id,
        quantity:20
      });
    });

    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(query.deleteorderproducts);
      await conn.query(queryo.deleteorders);
      await conn.query(queryp.deleteproducts);
      await conn.query(queryu.deleteuser);
      conn.release();
    });

});
