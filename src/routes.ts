import { Router } from "express";
import usersroute from "./handlers/users";
import productsRoute from "./handlers/products";
import ordersroute from "./handlers/orders";
import orderprouductsroute from "./handlers/order_products";

const route = Router();

route.use("/users", usersroute);
route.use("/products", productsRoute);
route.use("/orders", ordersroute);
route.use("/orderProducts", orderprouductsroute);

export default route;
