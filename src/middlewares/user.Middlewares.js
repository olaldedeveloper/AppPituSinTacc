import { usersService } from "../services/users.Service.js";   

export async function find_User_Middleware(req, res, next) {
  try {
    req.user = await usersService.find_User(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}

