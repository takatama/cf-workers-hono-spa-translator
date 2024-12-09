import { Hono } from 'hono'
// Step4 XSS対策
import { sanitize } from './sanitize'

type Bindings = {
  AI: any
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
  const formData = await c.req.formData()
  const prompt = formData.get('prompt')
  if (typeof prompt !== 'string') {
    return c.text('Invalid input', 400);
  }

  const messages = [
    {
      role: 'system',
      content: `Translate the following japanese into English phrases without additional comments.`,
    },
    { role: 'user', content: prompt },
    // Step4 XSS対策
    // { role: 'user', content: sanitize(prompt) },
  ]

  const answer = await c.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
    messages,
  })

  return c.text(answer.response)
})

export default app
