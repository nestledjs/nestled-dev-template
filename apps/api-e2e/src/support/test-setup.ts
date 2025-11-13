import axios from 'axios'

// Configure axios for tests to use.
const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ?? '3000'
axios.defaults.baseURL = `http://${host}:${port}`

// Global test configuration
process.env.NODE_ENV = 'test'

// NOTE: Tests run against the development database since the API server
// is already running and connected to it. Data is cleaned up after tests.
process.env.DATABASE_URL = 'postgresql://justinhandley@localhost:5432/nestled_template'

console.log(`Test setup: axios base URL set to ${axios.defaults.baseURL}`)
console.log(`Test setup: Using database - nestled_template (dev database)`)
