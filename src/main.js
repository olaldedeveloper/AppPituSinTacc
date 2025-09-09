import { Server } from "../app/app.js";
import { PORT } from "./config/config.js";

const server = new Server();
server.connect(PORT);
    
