import client from "../database";
import {products} from "../types/types";
import * as query from "../query/products"

class ProductStore {
  
  async indexP(): Promise<products[]> {
    try {

      const conn = await client.connect()

      const result = await conn.query(query.getproducts)

      conn.release()

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }

  async showP(productid: string): Promise<products> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.getproductbyId, [productid])

      conn.release();

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${productid}. Error ${err}`)
    }
  }

  async createP(p: products): Promise<products> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.createproduct as string, [p.pname,p.price])

      const product=result.rows[0]

      conn.release()

      return product
    } catch (err) {
      throw new Error(`Could not add new product ${p.pname}. Error: ${err}`)
    }
  }
  
  async updateP(p: products): Promise<products> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.updateproductbyId, [p.pname,p.price,p.productid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not update the product ${p.pname}. Error ${err}`);
    }
  }
 
  async deleteP(productid: string): Promise<products> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.deleteproductbyId, [productid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not delete product ${productid}). Error: ${err}`)
    }
  }
}

export default ProductStore ;
