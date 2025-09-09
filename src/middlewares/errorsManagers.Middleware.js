import { logger } from "../utils/winston.js";
export const ErrorType = {
  NOT_FOUND: 404,
  INVALID_DATA: 400,
  ERROR_REQUEST: 400,
  UNAUTHORIZED_USER: 401,
  FORBIDDEN_USER: 403,
};

export class NewError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

export async function manejadorDeErrores(error, req, res, next) {
  if (!error.code) {
    error.code = 400;
  }
  logger.ERROR(
    `${req.method}   ${error.code} - ${error.message} /
  | Date: ${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()} `
  );
  res.status(error.code).json({ status: "ERROR", message: error.message });
}
