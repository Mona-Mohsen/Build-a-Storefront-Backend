import productModel from "../products";
import client from "../../database";
import products from "../../types/products";

const ProductModel = new productModel();

describe("Products Model Unit Testing", () => {
  describe("Testing the defined methods", () => {
    it("should have a Create method", () => {
      expect(ProductModel.createP).toBeDefined();
    });

    it("should have an index method", () => {
      expect(ProductModel.indexP).toBeDefined();
    });

    it("should have a show method", () => {
      expect(ProductModel.showP).toBeDefined();
    });

    it("should have an update method", () => {
      expect(ProductModel.updateP).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(ProductModel.deleteP).toBeDefined();
    });
  });
  describe("Testing the CRUD operation of the Products Model", () => {
    const product = {
      pname: "Labtop",
      price: "2000",
    } as products;

    beforeAll(async () => {
      const creatProduct = await ProductModel.createP(product);
      product.productid = creatProduct.productid;
    });

    afterAll(async () => {
      const conn = await client.connect();
      const sql = `DELETE FROM products`;
      await conn.query(sql);
      conn.release();
    });

    it("index method should return all products", async () => {
      const products = await ProductModel.indexP();
      expect(products.length).toBe(1);
    });

    it("Create method should add a new product", async () => {
      const product = {
        pname: "PC",
        price: "3000",
      } as products;
      const creatProduct = await ProductModel.createP(product);
      product.productid = creatProduct.productid;
      expect(creatProduct.productid).toBe(product.productid);
      expect(creatProduct.pname).toBe(product.pname);
      expect(creatProduct.price).toBe(product.price);
    });

    it("show method should return correct product", async () => {
      const oneProduct = await ProductModel.showP(product.productid);
      expect(oneProduct.productid).toBe(product.productid);
      expect(oneProduct.pname).toBe(product.pname);
      expect(oneProduct.price).toBe(product.price);
    });
    it("update method should return the updated product", async () => {
      const updatedProduct = await ProductModel.updateP({
        ...product,
        pname: "Printer",
        price: "1000",
      });
      expect(updatedProduct.productid).toBe(product.productid);
      expect(updatedProduct.pname).toBe("Printer");
      expect(updatedProduct.price).toBe("1000");
    });

    it("delete method should remove product", async () => {
      const deleteProduct = await ProductModel.deleteP(product.productid);
      expect(deleteProduct.productid).toBe(product.productid);
      const prods = await ProductModel.indexP();
      expect(prods.length).toBe(1);
    });
  });
});
