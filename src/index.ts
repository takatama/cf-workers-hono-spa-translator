import { Hono } from 'hono'
import translate from './translate'
// import turnstile from './turnstile'
// import { sessionMiddleware } from './session'
// import { csrfMiddleware, secFetchSiteMiddleware } from './csrf'

const app = new Hono()

// app.use('*', csrfMiddleware())
// app.use('*', secFetchSiteMiddleware())
// app.use('/api/*', sessionMiddleware())

// app.route('/auth', turnstile)
app.route('/api/translate', translate)

export default app
