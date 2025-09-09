import { Router } from "express";
import {
  register,login,
  } from "../controllers/users.Controllers.js";
export const userRouter = new Router();

userRouter.post("/createuser",register);
userRouter.post("/login",login);
/*
userRouter.get("/logout",logout);
userRouter.get("/current",current);
userRouter.post("/resetPassword",resetPassword);
userRouter.post("/forgotPassword",forgotPassword);
userRouter.post(
  "/createuser",
  register,
  envioMail,
  updateLoginDate,
  async (req, res) => {
    res.created(req.user);
  }
);
*/





userRouter.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});