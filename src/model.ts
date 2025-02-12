import mongoose, { Schema, Types } from 'mongoose'

interface ILog {
  action: string
  user: Types.ObjectId
  oldValues: string[]
  newValues: string[]
  message: string
  date: Date
  group: string
  affected: any
}

const LogSchema = new Schema<ILog>({
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

const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema)

export { Log, LogSchema }
