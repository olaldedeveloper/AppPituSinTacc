import { Router } from "express";
import { userRouter } from "./users.Router.js";
import { productsRouter } from "./products.Router.js";
import { cartsRouter } from "./carts.Routers.js";

export const mainRouter = new Router();

//Se agregan las apis de productos y Carts

mainRouter.use("/user", userRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/carts", cartsRouter);