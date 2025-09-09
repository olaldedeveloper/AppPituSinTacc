import mongoose from "mongoose";
import { logger } from "../utils/winston.js";

export const mongoConfig = (uri) => {
  mongoose
    .connect(uri)
    .then(() => logger.INFO("MongoDB Connection Success"))
    .catch(() => logger.ERROR(`Error al conectar: ${error}`));
};
