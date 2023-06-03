import winston, { format, transports } from 'winston';
import moment from 'moment-timezone';

class Logger {
  private static customFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.simple(),
    format.printf((info) => {
      const { level, message } = info;
      const ts = moment().tz('America/Sao_Paulo').format('YYYY/MM/DD HH:mm:ss.SSS');
      return `${ts} [${level}]: ${message}`;
    }),
  );

  public static createLogger(): winston.Logger {
    const consoleTransport = new transports.Console({
      format: Logger.customFormat,
    });

    return winston.createLogger({
      transports: [consoleTransport],
    });
  }
}

const logger = Logger.createLogger();

export { logger };
