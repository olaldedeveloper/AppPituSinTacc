import { Router } from "express";

// import { ticketService } from "../services/tickets.Service.js";
import { read_Cookie_Middleware } from "../middlewares/cookies.Middleware.js";
import { addProductArrayByID,  checkStockAndAdd,  checkUserIsOwnerOfCart, createNewCart, deleteAllProductsOfCart, deleteOneProductOfCart, endShop, getCartsByID, showCartList, subtractProducts } from "../middlewares/carts.Middlewares.js";
import { checkAdmin } from "../middlewares/product.Middlewares.js";

export const cartsRouter = new Router();

//Carga de los controllers al router de carts

cartsRouter.use(read_Cookie_Middleware);
cartsRouter.post("/createNewCart", createNewCart);
cartsRouter.post("/:cId/product/:pid", checkUserIsOwnerOfCart,  addProductArrayByID);
cartsRouter.get("/:cId", checkUserIsOwnerOfCart, getCartsByID);
cartsRouter.get("/", checkAdmin,showCartList);

cartsRouter.delete(
  "/:cId/products/:pid",
  checkUserIsOwnerOfCart,
  deleteOneProductOfCart
);
cartsRouter.delete(
  "/:cId",
  checkUserIsOwnerOfCart,
  deleteAllProductsOfCart
);
cartsRouter.post(
  "/:cId/purchase",
  checkUserIsOwnerOfCart,checkStockAndAdd
  ,
  subtractProducts,
  endShop
);
/*
*/