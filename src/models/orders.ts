import client from "../database";
import {orders} from "../types/types";
import * as query from "../query/orders"

class OrderStore {

  async indexO(): Promise<orders[]> {
    try {
      const conn = await client.connect()
   
      const result = await conn.query(query.getorders)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get all orders. Error ${err}`);
    }
  }

  async showO(orderid: string): Promise<orders> {
    try {
      const conn = await client.connect();
       
      const result = await conn.query(query.getorderbyId, [orderid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not find order ${orderid}. Error: ${err}`);
    }
  }
 
  async createO(o: orders): Promise<orders> {
    try {
      const conn = await client.connect();
      
      const result = await conn.query(query.createorder as string, [
        o.ostatus,
        o.userid,
      ]);

      conn.release();
      const order = result.rows[0]
      return order

    } catch (err) {
      throw new Error(`Could not create an order. Error ${err}`);
    }
  }
 
  async updateO(o: orders): Promise<orders> {
    try {
      const conn = await client.connect()
     
      const result = await conn.query(query.updateorderbyId as string, [
        o.ostatus,
        o.userid,
        o.orderid,
      ])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not update the order ${err}`)
    }
  }
  
  async deleteO(orderid: string): Promise<orders> {
    try {
      const conn = await client.connect()
      
      const result = await conn.query(query.deleteorderbyId, [orderid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not delete the order ${orderid}. Error : ${err}`);
    }
  }
}

export default OrderStore;
