import { logger , setupHTTPLogger} from "../src/utils/winston.js";
import { mongoConfig } from "../src/config/mongodb.config.js";
import { URL_MONGO_ATLAS } from "../src/config/config.js";
import { mainRouter } from "../src/routers/main.Router.js";
import cookieParser from "cookie-parser";
import express from "express";
import { manejadorDeErrores } from "../src/middlewares/errorsManagers.Middleware.js";

export class Server{
    #app;
    constructor(){
        logger.INFO("Starting server...");
    }

    
  connect(port) {
    mongoConfig(URL_MONGO_ATLAS);
    this.#app = express();
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cookieParser());
    setupHTTPLogger(this.#app);
    this.#app.use("/pituSinTacc", mainRouter)
    this.#app.use(manejadorDeErrores)
    return new Promise((resolve, reject) => {
       this.#app.listen(port, () => {
        logger.INFO(`Server Listening Success | PORT: ${port}  `);
        resolve(true);
      });
    });
  }
  disconnect() {
    return new Promise((resolve, reject) => {
      this.#app.close((err) => {
        if (err) return reject(err);
        logger.INFO(`Server Disconnect Succes`);
        resolve(true);
      });
    });
  }
}
