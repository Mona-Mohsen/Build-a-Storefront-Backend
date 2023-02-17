import supertest from "supertest";
import app from "../../server";
import client from "../../database";
import * as queryu from "../../query/users";
import * as queryp from "../../query/products";
import dotenv from "dotenv";
import  {users, products}from "../../types/types";
import jwt from "jsonwebtoken";
import ProductStore from "../../models/products";
import UserStore from "../../models/users";

const productStore = new ProductStore();
const userStore = new UserStore();
const request = supertest(app);

dotenv.config();
const { TOKEN_SECRET } = process.env;


describe("Test API endpoints of Products", () => {

let user_id:string;
let pro_id:string;
let token:string = "token";

  beforeAll(async () => {
    //create user
    const newUser = await userStore.createU({
      username: "Admin",
      firstname: "Mona",
      lastname: "Mohsen",
      password: "P@ssw0rd",  
    } as users);

    user_id=newUser.userid;

    //create product
    const newproduct = await productStore.createP({
      pname: 'PC1',
      price: 2000
     } as products);

      pro_id= newproduct.productid;

    const user = await userStore.authenticate(newUser.username, newUser.password);
    token = jwt.sign({ user }, TOKEN_SECRET as string);  
  });

  it("GET products should get list of products", async () => {
    const res = await request.get("/products/")
      
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{
      productid:pro_id,
      pname: 'PC1',
      price: 2000
     }]);
  });

  it("POST product should add a new product", async () => {
    const res = await request
      .post("/products/")
      .set("Authorization", `Bearer `+ token)
      .send({pname: "PC",price: 4000});

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      productid:res.body.productid,
      pname: 'PC',
      price: 4000
    });
  });

  it("GET product by id should return correct product", async () => {
    const res = await request.get(`/products/${pro_id}/`)

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        productid:pro_id,
        pname: 'PC1',
        price: 2000
      });
    });

  it("PATCH products by id should update a product", async () => {
    const res = await request
      .patch(`/products/${pro_id}/`)
      .set("Authorization", `Bearer `+ token)
      .send({productid:pro_id,pname: "laptop",price: 3000 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      productid:pro_id,
      pname: 'laptop',
      price: 3000
    });
  });

  it("DELETE product by id should delete a product", async () => {
    const res = await request
      .delete(`/products/${pro_id}/`)
      .set("Authorization", `Bearer `+ token)

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      productid:pro_id,
      pname: 'laptop',
      price: 3000
    });
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query(queryu.deleteuser);
    await conn.query(queryp.deleteproducts);
    conn.release();
  });
  
});


