import { Router } from "express";
import usersRoute from "./users";
import productsRoute from "./products";
import ordersRoute from "./orders";
import orderProuductsRoute from "./order_products";

const route = Router();

route.use("/users", usersRoute);
route.use("/products", productsRoute);
route.use("/orders", ordersRoute);
route.use("/orderProducts", orderProuductsRoute);

export default route;
