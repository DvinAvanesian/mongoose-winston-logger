import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import LogSchema from '../src/models/log/schemas/log'

const Log = mongoose.model('Log', LogSchema)

beforeAll(async () => {
  if (!Bun.env.MONGO_URI) throw new Error('MongoDB URI must be set in .env!')
  await mongoose.connect(Bun.env.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('LogSchema', () => {
  it('should require action, user, and group fields', async () => {
    const log = new Log({})

    try {
      await log.validate()
    } catch (error: any) {
      expect(error.errors.action).toBeDefined()
      expect(error.errors.user).toBeDefined()
      expect(error.errors.group).toBeDefined()
    }
  })

  it('should set default date', async () => {
    const log = new Log({
      action: 'test',
      user: new mongoose.Types.ObjectId(),
      group: 'testGroup'
    })

    await log.validate()
    expect(log.date).toBeDefined()
  })
})
