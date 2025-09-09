import { usersService } from "../services/users.Service.js";
//import { emailService } from "../../services/email.service.js";
//import { validAdmin } from "../../middlewares/authorizathion.Middleware.js";

/*import {
  ErrorType,
  NewError,
} from "../../middlewares/errorsManagers.Middlewares.js";
*/
export async function current_Session(req, res) {
  try {
    if (req.user) {
      return res.result(req.user);
    }
    throw new Error("UNAUTHORIZED USER");
  } catch (error) {
    return res.status(404).json({ status: "error", message: error.message });
  }
}

export async function register(req, res, next) {
  try {
    req.user = await usersService.register(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
}
/*
export async function send_Mail(req, res, next) {
  emailService.send(
    req.user.email,
    "BIENVENIDO",
    ` Te Damos La Bienvenida ${req.user.first_name} AL ECOMERS`
  );
  next();
}

export async function change_Role_User(req, res, next) {
  try {
    const user = await usersService.cambiarRolUsuario(req.params.idUser);
    return res.result(user);
  } catch (error) {
    next(error);
  }
}

export async function check_Is_Admin(req, res, next) {
  try {
    req["isAdmin"] = await validAdmin(req);
    if (req.isAdmin) {
      next();
    } else {
      throw new NewError(
        ErrorType.FORBIDDEN_USER,
        "JUST ADMIN CAN CHANGE ROLES"
      );
    }
  } catch (error) {
    next(error);
  }
}
*/