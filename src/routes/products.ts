import { Router } from "express";
import * as handlers from "../handlers/products";
import CheckValid from "../middleware/authenticate";

const route = Router();

route.post("/", CheckValid, handlers.createP);
route.get("/", handlers.indexP);
route.get("/:productid", handlers.showP);
route.patch("/:productid", CheckValid, handlers.updateP);
route.delete("/:productid", CheckValid, handlers.removeP);

export default route;
