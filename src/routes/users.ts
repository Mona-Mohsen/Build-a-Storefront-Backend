import { Router } from "express";
import * as handlers from "../handlers/users";
import CheckValid from "../middleware/authenticate";

const route = Router();

route.post("/", handlers.createU);
route.get("/", CheckValid, handlers.indexU);
route.get("/:userid", CheckValid, handlers.showU);
route.patch("/:userid", CheckValid, handlers.updateU);
route.delete("/:userid", CheckValid, handlers.removeU);
route.post(`/authenticate`, handlers.authenticatedUser);

export default route;
