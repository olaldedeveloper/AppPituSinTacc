import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export function cryptData(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("Invalid data for encryption"));
    }
    jwt.sign(data, JWT_SECRET, { expiresIn: "12h" }, (err, encoded) => {
      //encoded:datos encriptados
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function decryptData(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(
        new NewError(ErrorType.UNAUTHORIZED_USER, "USER UNAUTHORIZED_USER")
      );
    }
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function crypt_One_Hour(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("Invalid data for encryption"));
    }
    jwt.sign(data, JWT_SECRET, { expiresIn: "1h" }, (err, encoded) => {
      //encoded:datos encriptados
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}
