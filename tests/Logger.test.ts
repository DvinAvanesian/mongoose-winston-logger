import dotenv from 'dotenv'
dotenv.config()
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import Logger from '../src/'
import { winstonLogger } from '../src/winston'

beforeAll(async () => {
  if (!process.env.MONGO_URI) throw new Error('MongoDB URI must be set in .env!')
  await mongoose.connect(process.env.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Logger', () => {
  it('should log info messages', () => {
    const logger = new Logger({ client: '127.0.0.1', user: 'testUser', url: '/test', method: 'GET' })
    const spy = vi.spyOn(winstonLogger, 'info')

    logger.info({ message: 'Test info message' })
    expect(spy).toHaveBeenCalledWith('[127.0.0.1] [GET at /test] [testUser] Test info message')
  })

  it('should log error messages', () => {
    const logger = new Logger({ client: '127.0.0.1', user: 'testUser', url: '/test', method: 'GET' })
    const spy = vi.spyOn(winstonLogger, 'error')

    logger.error({ message: 'Test error message' })
    expect(spy).toHaveBeenCalledWith('[127.0.0.1] [GET at /test] [testUser] Test error message')
  })

  it('should log actions to the database', async () => {
    const logger = new Logger({ client: '127.0.0.1', user: 'testUser', url: '/test', method: 'GET' })
    const spy = vi.spyOn(winstonLogger, 'info')

    await logger.action({
      message: 'Test action message',
      action: 'testAction',
      oldValues: ['old'],
      newValues: ['new'],
      group: 'testGroup',
      user: '60d0fe4f5311236168a109ca',
      affected: { user: ['60d0fe4f5311236168a109cb'] }
    })

    expect(spy).toHaveBeenCalledWith('[127.0.0.1] [GET at /test] [testUser] Test action message')
  })
})
