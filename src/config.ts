import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  SALT_ROUNDS,
  PEPPER,
  TOKEN_SECRET,
} = process.env;

export default {
  port: PORT,
  host: POSTGRES_HOST,
  dbport: POSTGRES_PORT,
  database: ENV === "dev" ? POSTGRES_DB : POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  saltRound: SALT_ROUNDS,
  pepper: PEPPER,
  token: TOKEN_SECRET,
};
