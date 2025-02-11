import type { Document as MongooseDocument, Types } from 'mongoose'

namespace Log {
  interface Interface {
    action: string
    user: Types.ObjectId
    oldValues: string[]
    newValues: string[]
    message: string
    date: Date
    group: string
    affected: any
  }

  interface Document extends Interface, MongooseDocument {}
}

export default Log
