import {Request, Response, Router} from "express";
import ProductStore from "../models/products";
import CheckValid from "../middleware/authenticate";

const productStore = new ProductStore();

export const indexP = async(req:Request, res:Response): Promise<void> => {

  try {
    const products = await productStore.indexP();
    res.json(products)
   
  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return all products");
  }
};

export const showP = async(req:Request, res:Response): Promise<void> => {
  try {
    const product = await productStore.showP(req.params.productid)

    res.json(product)

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to return all products");
  }
};

export const createP = async(req:Request, res:Response): Promise<void> => {
try {
  const newproduct = await productStore.createP(req.body)
  res.json(newproduct);
  
} catch (err) {
  res.status(400)
  res.json(err)
  throw new Error("faild to create product");
  }
};

export const updateP = async(req:Request, res:Response): Promise<void> => {
  try {
    const updated = await productStore.updateP(req.body);
    res.json(updated)
    
  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to update product");
  }
};

export const deleteP = async(req:Request, res:Response): Promise<void> => {
  try {
    const deleted = await productStore.deleteP(req.params.productid);
     res.json(deleted);

  } catch (err) {
    res.status(400)
    res.json(err)
    throw new Error("faild to delete product");
  }
};

const productroute = Router();

productroute.get("/", indexP);
productroute.get("/:productid", showP);

//all endpoints thats required validation
productroute.post("/", CheckValid, createP);
productroute.patch("/:productid", CheckValid, updateP);
productroute.delete("/:productid", CheckValid, deleteP);

export default productroute;
