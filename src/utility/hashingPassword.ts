
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { SALT_ROUNDS,PEPPER } = process.env;

const hash = (password: string) => {
  const salt: number = parseInt( SALT_ROUNDS as string, 10)

  const hashpassword = bcrypt.hashSync(`${password}+${PEPPER }`, salt)

  return hashpassword;
  
};

export default hash;
