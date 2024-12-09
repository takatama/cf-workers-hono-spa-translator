import { Hono } from 'hono'
import translate from './translate'
// Step1 Turnstileを導入
import turnstile from './turnstile'
// Step2 JWTでセッションを管理
import { sessionMiddleware } from './session'
// Step3 CSRF対策
import { csrfMiddleware, secFetchSiteMiddleware } from './csrf'

const app = new Hono()

// Step3 CSRF対策
app.use('*', csrfMiddleware())
app.use('*', secFetchSiteMiddleware())

// Step2 JWTでセッションを管理
app.use('/api/*', sessionMiddleware())

// Step1 Turnstileを導入
app.route('/auth', turnstile)
app.route('/api/translate', translate)

export default app
