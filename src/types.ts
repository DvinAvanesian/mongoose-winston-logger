import type { Document as MongooseDocument, Types } from 'mongoose'

export declare namespace Log {
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

export declare namespace Logger {
  interface Message {
    message?: string
  }

  interface Affected {
    user?: string[]
    client?: string[]
  }

  interface ActionProps extends Message {
    oldValues?: string[]
    newValues?: string[]
    group: string
    action: string
    user: string
    affected?: Affected
  }

  interface Interface {
    info(opts: Message): void
    action(opts: ActionProps): Promise<void>
    error(opts: Message): void
    update(opts: InitialProps): void
  }

  interface InitialProps {
    client?: string | null
    user?: string
    url?: string
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
}
