import { Hono } from 'hono'
import {logger} from 'hono/logger'

const app = new Hono()

app.use('*', logger())

export default { 
  port: 5000, 
  fetch: app.fetch, 
} 