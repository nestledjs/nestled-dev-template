import axios from 'axios'

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost'
  const port = process.env.PORT ?? '3000'
  axios.defaults.baseURL = `http://${host}:${port}`

  // Global test configuration
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/nestled_template_test'
}
