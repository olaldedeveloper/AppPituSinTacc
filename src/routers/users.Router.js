import { Router } from "express";

import { register,find_User_Middleware} from "../middlewares/user.Middlewares.js";
import { send_Cookie_Middleware, crypt_User_Middleware, decrypt_User_Middleware, logout, read_Cookie_Middleware } from "../middlewares/cookies.Middleware.js";
import { currentController, loginController, logoutController, registerController } from "../controllers/user.Controllers.js";

export const userRouter = new Router();

userRouter.post("/register",register,registerController);
userRouter.post("/login",find_User_Middleware,crypt_User_Middleware,send_Cookie_Middleware,loginController);
userRouter.get("/current",read_Cookie_Middleware,decrypt_User_Middleware, currentController);
userRouter.post('/logout', logout,logoutController);

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