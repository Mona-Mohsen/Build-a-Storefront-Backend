import OrderStore from "../../models/orders";
import UserStore from "../../models//users";

import client from "../../database";

import  {users, orders}from "../../types/types";

import * as queryo from "../../query/orders";
import * as queryu from "../../query/users";

const userStore = new UserStore();
const orderStore = new OrderStore();

describe("Orders Model Testing", () => {

  let order_id:string;
  let user_id:string;
  beforeAll(async () => {
    const newUser = await userStore.createU({
      username: "Memo",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",  
    } as users);
    user_id=newUser.userid;

    const neworder = await orderStore.createO({
      ostatus: "open",
      userid: user_id
    } as orders);
    order_id= neworder.orderid as string;
  });
   
 
  it("should have a Create method", () => {
    expect(orderStore.createO).toBeDefined();
  });

  it("should have index method", () => {
    expect(orderStore.indexO).toBeDefined();
  });

  it("should have show method", () => {
    expect(orderStore.showO).toBeDefined();
  });

  it("should have a update method", () => {
    expect(orderStore.updateO).toBeDefined();
  });

  it("should have a delete order method", () => {
    expect(orderStore.deleteO).toBeDefined();
  });
  
  it("index method should return a list of order", async () => {
  const result = await orderStore.indexO();
  expect(result).toEqual([{
  orderid: order_id,
  ostatus: "open",
  userid: user_id
    }] );
  }); 
  it("show method should return correct order by id", async () => {
    const result = await orderStore.showO(order_id);
    expect(result).toEqual({
    orderid: order_id,
    ostatus: "open",
    userid: user_id
      });
    });
  
  it("Create method should add a new order", async () => {
  const neworder = await orderStore.createO({
    ostatus: "complete",
    userid: user_id
  } as orders);
  order_id= neworder.orderid as string;  
  expect(neworder).toEqual({
      orderid:neworder.orderid,
      ostatus: "complete",
      userid: user_id
    });
  });
  
  it("update method should return the updated order", async () => {
    const result = await orderStore.updateO({
    orderid:order_id,
    ostatus: 'complete',
    userid: user_id
  });
  
  expect(result).toEqual({
    orderid:result.orderid,
    ostatus:'complete',
    userid:user_id
  });
  });
     
  it("delete method should remove order", async () => {
    const result = await orderStore.deleteO(order_id);
    expect(result).toEqual({
      orderid:result.orderid,
      ostatus:'complete',
      userid:user_id
    });
    const result1 = await orderStore.indexO();
    expect(result1.length).toBe(1);
  
  });
  
  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(queryo.deleteorders);
    await conn.query(queryu.deleteuser);
    conn.release();
  });  
 
});
