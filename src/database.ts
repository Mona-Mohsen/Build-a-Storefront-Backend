import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  ENV,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

let client: Pool;

client = new Pool({
  host: POSTGRES_HOST,
  database: ENV === "dev" ? POSTGRES_DB : POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
 
});

export default client;
