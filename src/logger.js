import { Log } from './model';
import { configureLogger, winstonLogger } from './winston';
import { Types } from 'mongoose';
// the Logger class used across the app for detailed logging
/**
 * The Logger class used for detailed logging across the application.
 * @implements {Logger.Interface}
 */
class Logger {
    /**
     * Creates an instance of Logger.
     * @param {Logger.InitialProps} props - The initial properties for the logger.
     */
    constructor({ client, user, url, method }) {
        // the props are only used for generating the log string
        this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`;
        // configure winston for logging to console and the log file
        configureLogger().catch((err) => {
            winstonLogger.error('Failed to configure logger:', err);
        });
    }
    /**
     * Updates the logger instance with new properties.
     * @param {Logger.InitialProps} props - The new properties for the logger.
     */
    update({ client, user, url, method }) {
        this.logInfoString = `${client ? `[${client}]` : ''}${url ? ` [${method ? `${method} at ` : ''}${url}]` : ''}${user ? ` [${user}]` : ''}`;
    }
    /**
     * Logs an informational message to the console and the log file.
     * @param {Logger.Message} message - The message to log.
     */
    info({ message }) {
        winstonLogger.info(`${this.logInfoString} ${message}`);
    }
    /**
     * Logs a basic message without creating an instance of Logger.
     * @param {string} message - The message to log.
     * @param {'error' | 'info'} [level='info'] - The log level.
     */
    static basic(message, level = 'info') {
        winstonLogger[level](message);
    }
    /**
     * Logs a detailed action to the database.
     * @param {Logger.ActionProps} props - The properties of the action to log.
     */
    async action({ message, action, oldValues, newValues, group, user, affected }) {
        // first, the informational log
        winstonLogger.info(`${this.logInfoString} ${message}`);
        // array for storing affected entities' oids
        const affectedUsers = [];
        const affectedClients = [];
        // push the oids of the affected entities to their corresponding array
        if (affected?.user) {
            for (const item of affected.user) {
                affectedUsers.push(new Types.ObjectId(item));
            }
        }
        if (affected?.client) {
            for (const item of affected.client) {
                affectedClients.push(new Types.ObjectId(item));
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
            });
            await doc.save();
        }
        catch (e) {
            winstonLogger.error(`Error creating log document: ${e.message}`);
        }
    }
    /**
     * Logs an error message to the console and the log file.
     * @param {Logger.Message} message - The message to log.
     */
    error({ message }) {
        winstonLogger.error(`${this.logInfoString} ${message}`);
    }
}
export { Logger };
