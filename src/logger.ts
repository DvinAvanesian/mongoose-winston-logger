import { Log } from './model'
import { configureLogger, winstonLogger } from './winston'
import mongoose from 'mongoose'
import { Logger } from './types'

/**
 * The Logger class used for detailed logging across the application.
 * @implements {Logger.ILogger}
 */
class Logger implements Logger.ILogger {
  // the string that is printed in the console and appended to the log file
  private logInfoString

  /**
   * Creates an instance of Logger.
   * @param {Logger.InitialProps} props - The initial properties for the logger.
   */
  constructor({ client, user, url, method }: Logger.InitialProps) {
    // the props are only used for generating the log string
    this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`

    // configure winston for logging to console and the log file
    configureLogger().catch((err: any) => {
      winstonLogger.error('Failed to configure logger:', err)
    })
  }

  /**
   * Updates the logger instance with new properties.
   * @param {Logger.InitialProps} props - The new properties for the logger.
   */
  update({ client, user, url, method }: Logger.InitialProps) {
    this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`
  }

  /**
   * Logs an informational message to the console and the log file.
   * @param {Logger.Message} message - The message to log.
   */
  info({ message }: Logger.Message) {
    winstonLogger.info(`${this.logInfoString} ${message}`)
  }

  /**
   * Logs a basic message without creating an instance of Logger.
   * @param {string} message - The message to log.
   * @param {'error' | 'info'} [level='info'] - The log level.
   */
  static basic(message: string, level: 'error' | 'info' = 'info') {
    winstonLogger[level](message)
  }

  /**
   * Logs a detailed action to the database.
   * @param {Logger.ActionProps} props - The properties of the action to log.
   */
  async action({ message, action, oldValues, newValues, group, user, affected }: Logger.ActionProps) {
    // first, the informational log
    winstonLogger.info(`${this.logInfoString} ${message}`)

    // array for storing affected entities' oids
    const affectedUsers: mongoose.Types.ObjectId[] = []
    const affectedClients: mongoose.Types.ObjectId[] = []

    // push the oids of the affected entities to their corresponding array
    if (affected?.user) {
      for (const item of affected.user) {
        affectedUsers.push(new mongoose.Types.ObjectId(item))
      }
    }

    if (affected?.client) {
      for (const item of affected.client) {
        affectedClients.push(new mongoose.Types.ObjectId(item))
      }
    }

    try {
      // create a mongoose document using the provided values
      const doc = new Log({
        action,
        message,
        oldValues,
        newValues,
        group,
        user: new mongoose.Types.ObjectId(user),
        affected: affected
          ? {
              user: affected.user ? affectedUsers : undefined,
              client: affected.client ? affectedClients : undefined
            }
          : undefined
      })

      await doc.save()
    } catch (e: any) {
      winstonLogger.error(`Error creating log document: ${e.message}`)
    }
  }

  /**
   * Logs an error message to the console and the log file.
   * @param {Logger.Message} message - The message to log.
   */
  error({ message }: Logger.Message) {
    winstonLogger.error(`${this.logInfoString} ${message}`)
  }
}

export default Logger
