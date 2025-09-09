import winston from "winston";
import morgan from 'morgan';

const customLevelsOptions = {
  levels: {
    FATAL: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    HTTP: 4,
    DEBUG: 5,
  },
  colors: {
    FATAL: "red",
    ERROR: "yellow",
    WARNING: "magenta",
    INFO: "blue",
    HTTP: "green",
    DEBUG: "grey",
  },
};

export const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "DEBUG",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./Errors/errors.log",
      level: "ERROR",
    }),
  ],
});

export const addLogger = async (req, res, next) => {
  logger.HTTP(
    ` ${req.method} - ${
      req.url
    } | ${new Date().toLocaleTimeString()} -  ${new Date().toLocaleDateString()}`
  );

};

export const setupHTTPLogger = (app) => {
  // Token personalizado para fecha y hora
  morgan.token('datetime', () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  });

  // Formato personalizado
  const format = ':method :url :status :res[content-length] - :response-time ms | :datetime';

  // Stream para enviar el mensaje a Winston
  const stream = {
    write: (message) => {
      logger.HTTP(message.trim());
    },
  };

  // Agregar middleware a Express
  app.use(morgan(format, { stream }));
};
