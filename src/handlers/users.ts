import { Request, Response, NextFunction, Router} from "express";
import UserStore from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CheckValid from "../middleware/authenticate";

dotenv.config();
const { TOKEN_SECRET } = process.env;

const userStore = new UserStore();

export const createU = async(req:Request, res:Response): Promise<void> => {
  try {
    const newuser = await userStore.createU(req.body)
    res.json(newuser)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to add new user");
  }
};

export const indexU = async(req:Request, res:Response): Promise<void> => {
  try {
    const users = await userStore.indexU();
    res.json(users);
  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return users");
  }
};

export const showU = async(req:Request, res:Response): Promise<void> => {
  try {
    const user = await userStore.showU(req.params.userid);
    res.json(user)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return user");
  }
};

export const updateU = async(req:Request, res:Response): Promise<void> => {
  try {
    const updated = await userStore.updateU(req.body)
    res.json(updated)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to update user");
  }
};

export const removeU = async(req:Request, res:Response): Promise<void> => {
  try {
    const removed = await userStore.deleteU(req.params.userid);
    res.json(removed);
  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to delete user");
  }
};

export const authenticatedUser = async(req:Request, res:Response, next:NextFunction) => {

  try {
    const { username, password } = req.body;
    const user = await userStore.authenticate(username, password);
    const token = jwt.sign({ user }, TOKEN_SECRET as string);
    if (!user) {
      return res.status(401).json("Access denied. User name or password is wrong ");
    }
    res.json({...user,token})

  } catch (err) {
    res.status(400)
    next(err)
    throw new Error("faild to user access");
   
  }
};

const userroute = Router();

userroute.post("/", createU);
userroute.post(`/authenticate`, authenticatedUser);

//all endpoints thats required validation
userroute.get("/", CheckValid, indexU);
userroute.get("/:userid", CheckValid, showU);
userroute.patch("/:userid", CheckValid, updateU);
userroute.delete("/:userid", CheckValid, removeU);


export default userroute;
