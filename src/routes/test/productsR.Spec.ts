import supertest from "supertest";
import app from "../../server";
import client from "../../database";

import users from "../../types/users";
import products from "../../types/products";

import productModel from "../../models/products";
import userModel from "../../models/users";

const ProductModel = new productModel();
const UserModel = new userModel();
const request = supertest(app);
let token = "";

describe("#Testing endpoints of Products Model#", () => {
  const product = {
    pname: "PC",
    price: "2000",
  } as products;

  const user = {
    username: "Admin",
    firstname: "Mona",
    lastname: "Mohsen",
    password: "P@ssw0rd",
  } as users;

  beforeAll(async () => {
    const createUser = await UserModel.createU(user);
    user.userid = createUser.userid;
    const creatProduct = await ProductModel.createP(product);
    product.productid = creatProduct.productid;
  });

  afterAll(async () => {
    const conn = await client.connect();
    const sql = `DELETE FROM users`;
    await conn.query(sql);
    const sql1 = `DELETE FROM products`;
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

    it("should be failed to authenticated  with wrong user name", async () => {
      const res = await request
        .post("/users/authenticate")
        .set("Content-type", "application/json")
        .send({ username: "xxx", password: "yyy" });
      expect(res.status).toBe(401);
    });
  });
  describe("Testing CRUD Operation methods for Products model", () => {
    it("User add a new product", async () => {
      const res = await request
        .post("/products/")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          pname: "Printer",
          price: "1000",
        } as products);
      expect(res.status).toBe(200);
      const { pname, price } = res.body.data;
      expect(pname).toBe("Printer");
      expect(price).toBe("1000");
    });

    it("should get list of products", async () => {
      const res = await request
        .get("/products/")
        .set("Content-type", "application/json");
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(2);
    });

    it("should return  correct product by id", async () => {
      const res = await request
        .get(`/products/${product.productid}/`)
        .set("Content-type", "application/json");
      const { pname, price } = res.body.data;
      expect(pname).toBe("PC");
      expect(price).toBe("2000");
    });

    it("should update a product", async () => {
      const res = await request
        .patch(`/products/${product.productid}/`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...product,
          pname: "laptop",
          price: "3000",
        });
      expect(res.status).toBe(200);
      const { productid, pname, price } = res.body.data;
      expect(productid).toBe(product.productid);
      expect(pname).toBe("laptop");
      expect(price).toBe("3000");
    });

    it("should delete a product", async () => {
      const res = await request
        .delete(`/products/${product.productid}/`)
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.productid).toBe(product.productid);
      expect(res.body.data.pname).toBe("laptop");
      expect(res.body.data.price).toBe("3000");
    });
  });
});
