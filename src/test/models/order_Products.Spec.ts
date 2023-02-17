import client from "../../database";

import * as queryu from "../../query/users";
import * as queryp from "../../query/products";
import * as queryo from "../../query/orders";
import * as query from "../../query/order_products";

import UserStore from "../../models/users";
import ProductStore from "../../models/products";
import OrderStore from "../../models/orders";
import OrderProductStore from "../../models/order_products";

import  {users, products, orders,order_products}from "../../types/types";

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const orderProductStore = new OrderProductStore();

describe("Orders Products Model Test", () => {

  let user_id:string;
  let pro_id:string;
  let order_id:string;
  let orderproduct_id:string;

  beforeAll(async () => {
    //create user
    const newUser = await userStore.createU({
      username: "Memo",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd"
    } as users);
    user_id=newUser.userid;

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
  
  it("should have Create methode", () => {
    expect(orderProductStore.create).toBeDefined();
  });

  it("should have index methode", () => {
    expect(orderProductStore.index).toBeDefined();
  });

  it("should have show methode", () => {
    expect(orderProductStore.show).toBeDefined();
  });

  it("should have update methode", () => {
    expect(orderProductStore.update).toBeDefined();
  });

  it("should have delete methode", () => {
    expect(orderProductStore.delete).toBeDefined();
  });
 
  
  it("index method should return a list of order poducts", async () => {
    const result = await orderProductStore.index();

    expect(result).toEqual([{
      orderproductid:orderproduct_id,
      productid: pro_id,
      orderid: order_id,
      quantity:10
      }] );

    const result2 = await orderProductStore.index();
    expect(result2.length).toBe(1);
    });

  it("show method should return correct oreders products", async () => {
    const result = await orderProductStore.show(orderproduct_id)

    expect(result).toEqual({
        orderproductid:orderproduct_id,
        productid: pro_id,
        orderid: order_id,
        quantity:10
    });
  });

  it("Create method should add a new order product", async () => {
    const neworderproduct = await orderProductStore.create({
      productid: pro_id,
      orderid: order_id,
      quantity:20
    } as order_products);

    orderproduct_id= neworderproduct.orderproductid

    expect(neworderproduct).toEqual({
      orderproductid:neworderproduct.orderproductid,
      productid: pro_id,
      orderid: order_id,
      quantity:20
    })
  })
  
  it("update method should return the updated order product", async () => {
      const result = await orderProductStore.update({
      orderproductid:orderproduct_id,
      productid: pro_id,
      orderid: order_id,
      quantity:100
    });
    
    expect(result).toEqual({
      orderproductid:result.orderproductid,
      productid: pro_id,
      orderid: order_id,
      quantity:100
    });
  });

  it("delete method should remove order product", async () => {
    const result = await orderProductStore.delete(orderproduct_id)

    expect(result).toEqual({
      orderproductid:result.orderproductid,
      productid: pro_id,
      orderid: order_id,
      quantity:100
    });

    const result1 = await orderProductStore.index()

    expect(result1.length).toBe(1);
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
