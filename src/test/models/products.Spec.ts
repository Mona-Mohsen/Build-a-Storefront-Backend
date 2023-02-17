import ProductStore from "../../models/products";
import client from "../../database";
import {products} from "../../types/types";
import * as  query from "../../query/products";

const productStore = new ProductStore();


describe("Product Model Test", () => {
    
    let pro_id:string;
    
    beforeAll(async () => {
      const createproduct = await productStore.createP({
         pname: 'PC',
         price: 3000
        } as products);
         pro_id= createproduct.productid as string;
    });

    it("should have an index method", () => {
      expect(productStore.indexP).toBeDefined();
    });

    it("should have a show method", () => {
      expect(productStore.showP).toBeDefined();
    });

    it("should have a Create method", () => {
      expect(productStore.createP).toBeDefined();
    });

    it("should have an update method", () => {
      expect(productStore.updateP).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(productStore.deleteP).toBeDefined();
    });

  
    it("index method should return a list of products", async () => {
      const result = await productStore.indexP();
      expect(result).toEqual([{
      productid:pro_id,
      pname: "PC",
      price: 3000
        }]);
      });

    it("show method should return correct product", async () => {
      const result = await productStore.showP(pro_id);
      expect(result).toEqual({
      productid:result.productid ,
      pname: "PC",
      price: 3000 
      });
    });

      it("Create method should add a new product", async () => {
        const result = await productStore.createP({
          pname: 'PC2',
          price: 5000
        }as products);
        
        expect(result).toEqual({
          productid:result.productid,
          pname: "PC2",
          price: 5000
        });
      });

      it("update method should return the updated product", async () => {
        const result = await productStore.updateP({
        productid:pro_id,
        pname: 'PC',
        price: 2500
      });
      
      expect(result).toEqual({
        productid:result.productid,
        pname: "PC",
        price: 2500
      });
      });

     it("delete method should remove product", async () => {
      const result = await productStore.deleteP(pro_id);
      expect(result).toEqual({
        productid:result.productid,
        pname: "PC",
        price: 2500
      });
    });

    afterAll(async () => {
      const conn = await client.connect();
      await conn.query(query.deleteproducts);
      conn.release();
    });
    
  });

