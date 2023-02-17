import client from "../database";
import {users} from "../types/types";
import hash from "../utility/hashingPassword";
import bcrypt from "bcrypt";
import * as query from "../query/users"
import dotenv from "dotenv";

dotenv.config();
const {PEPPER} = process.env;

class UserStore {
  
  async indexU(): Promise<users[]> {
    try {
      const conn = await client.connect();
     
      const result = await conn.query(query.getusers);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get all users`);
    }
  }

  async showU(userid: string): Promise<users> {
    try {
      const conn = await client.connect();
     
      const result = await conn.query(query.getuserbyId, [userid]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not get the correct user. Error  ${(err as Error).message}`
      );
    }
  }
  
  async createU(u: users): Promise<users> {
    try {
      const conn = await client.connect();
      const result = await conn.query(query.createusers as string, [
        u.username,
        u.firstname,
        u.lastname,
        hash(u.password),
      ])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not create your user name:(${u.username}). Error:  ${err}`);
    }
  }
  
  async updateU(u: users): Promise<users> {
    try {
      const conn = await client.connect();
     
      const result = await conn.query(query.updateuserbyId, [
        u.username,
        u.firstname,
        u.lastname,
        hash(u.password),
        u.userid,
      ])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not update user ${u.userid}. Error ${err}`);
    }
  }
 
  async deleteU(userid: string): Promise<users> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.deleteuserbyId, [userid])

      conn.release()

      return result.rows[0]

    } catch (err) {
      throw new Error(`Could not remove user ${userid}. Error: ${err}`);
    }
  }
  
  async authenticate(username: string,password: string): Promise<users | null> {
    try {
      const conn = await client.connect()

      const result = await conn.query(query.getpassbyusername, [username])

      conn.release()
      
      if (result.rows.length) {

        const { password: hash } = result.rows[0]
        const hashpass = bcrypt.compareSync(`${password}+${PEPPER}`,hash )

        if (hashpass) {

          const conn = await client.connect()
  
          const dataUser = await conn.query(query.validuser,[username])
  
          conn.release()

          const user = dataUser.rows[0]
  
          return user
        }
      }

      return null

    }catch (err) {
      throw new Error(`Could not authenticate user. Error: ${err}`);
    }
  }
}

export default UserStore;
