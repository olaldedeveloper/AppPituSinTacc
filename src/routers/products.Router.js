import { Router } from "express";

import {
  getProductsController,
  getProductsById,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getProductsPaginate,updateIMG,
  checkIsAllowed,
  } from "../middlewares/product.Middlewares.js"
  import { upload } from "../config/multer.Config.js";

import { decrypt_User_Middleware } from "../middlewares/cookies.Middleware.js";
//import { uploadProducts } from "../../middlewares/multer.Middlewares.js";

export const productsRouter = new Router();
productsRouter.post("/createNewProduct",decrypt_User_Middleware,upload.single('file'),updateIMG, addNewProduct);

productsRouter.put("/:pid", decrypt_User_Middleware,getProductsById,checkIsAllowed,upload.single('file'),updateIMG,updateProduct);
productsRouter.get("/", getProductsController);
productsRouter.get("/productsPaginate", getProductsPaginate);
productsRouter.get("/:pid", getProductsById,(req,res)=>{res.json(req.product)});

productsRouter.delete(
  "/:pid",
  decrypt_User_Middleware,deleteProduct
);