import { Router } from "express";
import * as handlers from "../handlers/orders";
import CheckValid from "../middleware/authenticate";

const route = Router();

route.post("/", CheckValid, handlers.createO);
route.get("/", CheckValid, handlers.indexO);
route.get("/:orderid", CheckValid, handlers.showO);
route.patch("/:orderid", CheckValid, handlers.updateO);
route.delete("/:orderid", CheckValid, handlers.removeO);

export default route;
