import supertest from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";
import client from "../../database";
import dotenv from "dotenv"
import * as queryu from "../../query/users";
import * as queryo from "../../query/orders";
import OrderStore from "../../models/orders";
import UserStore from "../../models/users";

import  {users,orders}from "../../types/types";

const orderStore = new OrderStore();
const userStore = new UserStore();
const request = supertest(app);

dotenv.config();
const { TOKEN_SECRET } = process.env;

describe("Test endpoints of Order", () => {
let user_id:string;
let order_id:string;
let token:string = "TOKEN";

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

  //create order
  const newproduct = await orderStore.createO({
    ostatus: "Open",
    userid:user_id
   } as orders);

   order_id= newproduct.orderid;
});

it("GET order by id should return correct order", async () => {
    const res = await request.get("/orders/"+ order_id +"/")
    .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        orderid:order_id,
        ostatus: 'Open',
        userid: user_id
    });
  });

  it("POST order should add a new order", async () => {
    const res = await request
      .post("/orders/")
      .set("Authorization", `Bearer `+ token)
      .send({ostatus: "Complete",userid: user_id});

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      orderid:res.body.orderid,
      ostatus: "Complete",
      userid: user_id
    });
  });

  it("PATCH order by id should update an order", async () => {
    const res = await request
      .patch("/orders/"+ order_id +"/")
      .set("Authorization", `Bearer `+ token)
      .send({orderid:order_id,ostatus:'Cancelled',userid: user_id});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      orderid:order_id,
      ostatus: 'Cancelled',
      userid: user_id
    });
  });

  it("DELETE order by id should delete an oders", async () => {
    const res = await request
      .delete("/orders/"+ order_id +"/")
      .set("Authorization", `Bearer `+ token)

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      orderid:order_id,
      ostatus: 'Cancelled',
      userid: user_id
    });
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(queryo.deleteorders);
    await conn.query(queryu.deleteuser);
    conn.release();
  });

    

  
});
