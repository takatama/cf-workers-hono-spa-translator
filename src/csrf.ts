import { createMiddleware } from "hono/factory"
import { csrf } from "hono/csrf"
import { HTTPException } from "hono/http-exception"

type Bindings = {
  ALLOWED_ORIGIN: string,
}

export const csrfMiddleware = () => createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const origin = c.env.ALLOWED_ORIGIN
  if (!origin) {
    throw new Error('環境変数 ALLOWED_ORIGIN が定義されていません。')
  }
  const csrfProtection = csrf({ origin })
  await csrfProtection(c, next)
})

export const secFetchSiteMiddleware = () => createMiddleware(async (c, next) => {
  const secFetchSite = c.req.header('Sec-Fetch-Site')
  if (secFetchSite && secFetchSite !== 'same-origin') {
    const res = new Response('Forbidden', {
      status: 403,
    })
    throw new HTTPException(403, { res })
  }
  return next()
})
