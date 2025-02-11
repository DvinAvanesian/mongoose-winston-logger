import { Log } from '../models/log'
import { configureLogger, winstonLogger } from '../lib/winston'
import { Types } from 'mongoose'
import type { Logger } from '../types/Logger'

// the Logger class used across the app for detailed logging
class Logger implements Logger.Interface {
  // the string that is printed in the console and appended to the log file
  private logInfoString

  // logger instance can be initialized with a client (ip), user (username), api endpoint, and the request method
  constructor({ client, user, url, method }: Logger.InitialProps) {
    // the props are only used for generating the log string
    this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`

    // configure winston for logging to console and the log file
    configureLogger().catch(err => {
      winstonLogger.error('Failed to configure logger:', err)
    })
  }

  // update the logger instance to change the proper below
  update({ client, user, url, method }: Logger.InitialProps) {
    this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`
  }

  // used for informational logging to the console and the log file
  info({ message }: Logger.Message) {
    winstonLogger.info(`${this.logInfoString} ${message}`)
  }

  // a simple static method used when we don't want to create an instance of Logger
  static basic(message: string, level: 'error' | 'info' = 'info') {
    winstonLogger[level](message)
  }

  // logging write actions to the database in details
  async action({ message, action, oldValues, newValues, group, user, affected }: Logger.ActionProps) {
    // first, the informational log
    winstonLogger.info(`${this.logInfoString} ${message}`)

    // array for storing affected entities' oids
    const affectedUsers: Types.ObjectId[] = []
    const affectedClients: Types.ObjectId[] = []

    // push the oids of the affected entities to their corresponding array
    if (affected?.user) {
      for (const item of affected.user) {
        affectedUsers.push(new Types.ObjectId(item))
      }
    }

    if (affected?.client) {
      for (const item of affected.client) {
        affectedClients.push(new Types.ObjectId(item))
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
        user: new Types.ObjectId(user),
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

  // used for logging an error to the console and the log file
  error({ message }: Logger.Message) {
    winstonLogger.error(`${this.logInfoString} ${message}`)
  }
}

export { Logger }
