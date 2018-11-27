const winston = require('winston');
const logger = winston.createLogger({
   transports: [
      new winston.transports.Console({
         level: 'info',
         name: 'info-console',
         colorize: true,
         timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
         formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
      }),

      new winston.transports.File({
         filename: 'combined.log',
         level: 'info',
         timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
         formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
         json: false
      }),

      new winston.transports.File({
         filename: 'errors.log',
         level: 'error',
         timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
         formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
         json: false
      }),

      new winston.transports.Console({
         level: 'error',
         name: 'error-console',
         colorize: true,
         timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
         formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
      }),
   ],
   exitOnError: false
});
module.exports = logger;