import * as winston from 'winston';
import * as moment from 'moment-timezone';

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.simple(),
  winston.format.printf((info): winston.Logform.Format => {
    const { timestamp, level, message } = info;

    const ts = moment().tz('America/Sao_Paulo').format('YYYY/MM/DD HH:mm:ss.SSS');
    return `${ts} [${level}]: ${message}`;
  }),
);

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: customFormat,
    }),
  ],
});

const logger = {
  error: (message: unknown, ...args: unknown[]): void => {
    winstonLogger.error(message);
  },
  warn: (message: unknown, ...args: unknown[]): void => {
    winstonLogger.warn(message);
  },
  info: (message: unknown, ...args: unknown[]): void => {
    winstonLogger.info(message);
  },
  debug: (message: unknown, ...args: unknown[]): void => {
    winstonLogger.debug(message);
  },
};

export { logger };
