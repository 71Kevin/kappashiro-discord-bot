import winston, { format } from 'winston';
import moment from 'moment-timezone';

const customFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.simple(),
  format.printf((info) => {
    const { level, message } = info;

    const ts = moment().tz('America/Sao_Paulo').format('YYYY/MM/DD HH:mm:ss.SSS');
    return `${ts} [${level}]: ${message}`;
  }),
);

function createLogger(): winston.Logger {
  const consoleTransport = new winston.transports.Console({
    format: customFormat,
  });

  return winston.createLogger({
    transports: [consoleTransport],
  });
}

const logger = createLogger();

export { logger };
