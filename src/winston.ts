import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// create a winston logger
export const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ _level, message, timestamp }) => {
      return `[${timestamp}] ${message}`
    })
  ),
  transports: [new winston.transports.Console()]
})

// configure the logger with daily rotating file transports
export const configureLogger = async () => {
  const logsDir = process.env.LOGS_DIR || './logs/'

  // daily rotate file for errors
  const errorTransport = new DailyRotateFile({
    filename: '%DATE%_error',
    extension: '.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    dirname: logsDir
  })

  // daily rotate file for info
  const infoTransport = new DailyRotateFile({
    filename: '%DATE%_info',
    extension: '.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    dirname: logsDir
  })

  winstonLogger.clear()
  // ? not sure what the clear() method does
  winstonLogger.add(errorTransport)
  winstonLogger.add(infoTransport)
  // enabling console log
  winstonLogger.add(new winston.transports.Console())
}
