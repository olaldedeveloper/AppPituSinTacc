import { Router } from "express";
import {
  register,
  } from "../controllers/users.Controllers.js";
import { find_User_Middleware} from "../middlewares/user.Middlewares.js";
import { check_Cookie_Middleware, crypt_User_Middleware, decrypt_User_Middleware, logout, read_Cookie_Middleware } from "../middlewares/cookies.Middleware.js";

export const userRouter = new Router();

userRouter.post("/createuser",register);
userRouter.post("/login",find_User_Middleware,crypt_User_Middleware,check_Cookie_Middleware);
userRouter.get("/current",read_Cookie_Middleware,decrypt_User_Middleware, async (req, res) => {
  res.status(200).json({ user: req.user });
});
userRouter.post('/logout', logout);

/*
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