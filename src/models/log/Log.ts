import mongoose from 'mongoose'
import type Log from './types/Log'
import LogSchema from './schemas/log'

const Log = mongoose.models.Log || mongoose.model<Log.Document>('Log', LogSchema)

export { Log }
