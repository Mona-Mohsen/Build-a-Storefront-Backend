import { Request, Response, Router} from "express";
import OrderStore from "../models/orders";
import CheckValid from "../middleware/authenticate";

const orderStore = new OrderStore();

export const indexO = async(req:Request, res:Response): Promise<void> => {
  try {
    const orders = await orderStore.indexO()

    res.json(orders)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to get orders");
  }
};

export const showO = async(req:Request, res:Response): Promise<void> => {

  try {
    const order = await orderStore.showO(req.params.orderid)

    res.json(order)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to get order");
  }
};

export const createO = async(req:Request, res:Response): Promise<void> => {

  try {
    const neworder = await orderStore.createO(req.body)

    res.json(neworder)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to add order");
  }
};

export const updateO = async(req:Request, res:Response): Promise<void> => {

  try {
    const updated = await orderStore.updateO(req.body)

    res.json(updated)
      
  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to update order. Error"+ err);
  }
};

export const removeO = async(req:Request, res:Response): Promise<void> => {

  try {
    const removed = await orderStore.deleteO(req.params.orderid)

    res.json(removed);

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to delete order");
  }
};


const route = Router();

//all endpoints required validation
route.post("/", CheckValid, createO);
route.get("/", CheckValid, indexO);
route.get("/:orderid", CheckValid, showO);
route.patch("/:orderid", CheckValid, updateO);
route.delete("/:orderid", CheckValid, removeO);

export default route;

