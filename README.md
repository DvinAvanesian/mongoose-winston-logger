# @dvinav/mwlogger

`@dvinav/mwlogger` is an npm package that provides a logger class for integrating Mongoose with Winston. This package helps you log Mongoose queries and operations using the Winston logging library.

## Installation

To install the package, use npm or bun:

```bash
npm install @dvinav/mwlogger
```

or

```bash
bun add @dvinav/mwlogger
```

## Usage

```javascript
import { mongoose } from mongoose
import Logger from '@dvinav/mwlogger'

// Initialize Mongoose
mongoose.connect(process.env.YOUR_MONGODB_URI)

// Create an instance of Logger
const logger = new Logger({ client: '1.2.3.4', url: '/your/api/endpoint', method: 'GET' })

// Basic info logging
logger.info({ message: 'Your message' })

// Update the logger with additional data
logger.update({
  client: XFW,
  url: '/your/api/endpoint',
  method: 'POST',
  user: 'user id'
})

// Log a user action to the database
await logger.action({
  message: 'Your message',
  action: 'action identifier',
  group: crypto.randomUUID(), // This is for when you have multiple types of log in a single action, so all of them are under the same group (all of them must have same group)
  user: 'the user',
  oldValues: ['the', 'old', 'values'],
  newValues: ['the', 'new', 'values'],
  affected: {
    company: 'ABC',
    user: 'johndoe'
  } // All affected entities
})
```

## Testing

For testing, ensure that `MONGO_URI` is set in your `.env` file:

```
MONGO_URI=mongodb://localhost:27017/testdb
```

Optionally, you can set the `LOGS_DIR` environment variable to specify a custom directory for log files:

```
LOGS_DIR=/path/to/custom/log/dir
```

## License

This project is licensed under the MIT License.
