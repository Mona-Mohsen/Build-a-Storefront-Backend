import { Request, Response, Router} from "express";
import OrderProductStore from "../models/order_products";
import CheckValid from "../middleware/authenticate";

const orderProductStore = new OrderProductStore();

export const create = async(req:Request, res:Response): Promise<void> => {

  try {
    const neworderProducts = await orderProductStore.create(req.body)

    res.json(neworderProducts)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to create order product");
  }
};

export const index = async(req:Request, res:Response): Promise<void> => {

  try {
    const orderProducts = await orderProductStore.index()

    res.json(orderProducts)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return order products");
  }
};

export const show = async(req:Request, res:Response): Promise<void> => {

  try {
    const orderProduct = await orderProductStore.show(req.params.orderproductid)

    res.json(orderProduct)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return order product");
  }
};

export const update = async(req:Request, res:Response): Promise<void> => {
  try {
    const updated = await orderProductStore.update(req.body);
    res.json(updated)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to update order product");
  }
};

export const remove = async(req:Request, res:Response): Promise<void> => {
  try {
    const removed = await orderProductStore.delete(req.params.orderproductid);
    res.json(removed)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to delete order product");
  }
};


const orderprouductroute = Router();

//all endpoints required validation
orderprouductroute.post("/", CheckValid, create);
orderprouductroute.get("/", CheckValid, index);
orderprouductroute.get("/:orderproductid", CheckValid, show);
orderprouductroute.patch("/:orderproductid", CheckValid, update);
orderprouductroute.delete("/:orderproductid", CheckValid, remove);

export default orderprouductroute;

