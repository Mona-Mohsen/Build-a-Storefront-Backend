import client from "../database";
import {order_products} from "../types/types";
import * as query from "../query/order_products";

class OrderProductStore {
  
  async index(): Promise<order_products[]> {
    try {
      const conn = await client.connect()
    
      const result = await conn.query(query.getorderproducts)

      conn.release()

      return result.rows

    } catch (error) {
      throw new Error(`Could not return all ordered products`);
    }
  }
 
  async show(orderproductid: string): Promise<order_products> {
    try {
      const conn = await client.connect();
      
      const result = await conn.query(query.getorderproductbyId, [orderproductid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not get the ordered products. Error ${err}`);
    }
  }
  
  async create(op: order_products): Promise<order_products> {
    try {
      const conn = await client.connect()
     
      const result = await conn.query(query.createorderproduct as string, [
        op.productid,
        op.orderid,
        op.quantity
      ])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not create ordered products ${op.orderproductid}. Error:${err}`);
    }
  }

  async update(op: order_products): Promise<order_products> {
    try {
      const conn = await client.connect()
      
      const result = await conn.query(query.updateorderproductbyId as string, [
        op.productid,
        op.orderid,
        op.quantity,
        op.orderproductid
      ])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`could not update the order products. Error ${err}`);
    }
  }
  
  async delete(orderproductid: string): Promise<order_products> {
    try {
      const conn = await client.connect()
      
      const result = await conn.query(query.deleteorderproductbyId, [orderproductid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not remove the order products ${orderproductid}. Error ${err}`);
    }
  }
}

export default OrderProductStore;
