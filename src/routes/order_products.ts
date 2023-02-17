import { Router } from "express";
import * as handlers from "../handlers/order_products";
import CheckValid from "../middleware/authenticate";

const route = Router();

route.post("/", CheckValid, handlers.create);
route.get("/", CheckValid, handlers.index);
route.get("/:orderproductid", CheckValid, handlers.show);
route.patch("/:orderproductid", CheckValid, handlers.update);
route.delete("/:orderproductid", CheckValid, handlers.remove);

export default route;
