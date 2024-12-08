import { Hono } from 'hono'
// import { createSessionCookie } from './session'

type ResponseJson = {
  success: boolean
}

export async function verifyTurnstileToken(secretKey: string, token: string, ip: string | undefined) {
  const formData = new FormData()
  formData.set('secret', secretKey)
  formData.set('response', token)
  formData.set('remoteip', ip ?? '')
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  const data: ResponseJson = await response.json()
  if (!data.success) {
    console.error(data)
  }
  return data.success
}

type Bindings = {
  TURNSTILE_SECRET_KEY: string,
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
  const secret = c.env.TURNSTILE_SECRET_KEY
  const formData = await c.req.formData()
  const token = formData.get('cf-turnstile-response')
  const ip = c.req.header('CF-Connecting-IP')
  if (!token || typeof token !== 'string') {
    return c.text('Invalid input', 400)
  }
  const isValid = await verifyTurnstileToken(secret, token, ip);
  if (!isValid) {
    return c.text('Unauthenticated', 401)
  }

  // await createSessionCookie(c, { user: 'authenticated' }, c.env.JWT_SECRET)
  return c.text('Authenticated')
})

export default app
