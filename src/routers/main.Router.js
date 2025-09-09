import { Router } from "express";
import { userRouter } from "./users.Router.js";

export const mainRouter = new Router();

//Se agregan las apis de productos y Carts

mainRouter.use("/user", userRouter,(req, res) => {
  res.status(200).json({ status: "success", message: "TODOBIEN" });
});
