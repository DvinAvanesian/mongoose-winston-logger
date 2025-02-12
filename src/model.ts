import mongoose, { Schema } from 'mongoose'
import type { Log } from './types'

const LogSchema = new Schema<Log.Document>({
  action: {
    type: String,
    required: true
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  oldValues: [{ type: String }],
  newValues: [{ type: String }],
  message: { type: String },
  date: { type: Date, default: Date.now },
  group: { type: String, required: true }, // update group specifier; for when multiple actions are done,
  affected: { type: Schema.Types.Mixed, _id: false, __v: false }
})

const Log = mongoose.models.Log || mongoose.model<Log.Document>('Log', LogSchema)

export { Log, LogSchema }
