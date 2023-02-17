import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

const CheckValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const AuthorizationHeader = req.get("Authorization");
    if (AuthorizationHeader) {
      const token = AuthorizationHeader.split(" ")[1];
    
      
      if (jwt.verify(token, TOKEN_SECRET as string)) {
        next();
      } else {
        throw new Error("Invalid token. Access denied");
      }
    } else {
      throw new Error("Invalid token. Access denied");
    }
  } catch (err) {
    res.status(401);

  }
};

export default CheckValid;
