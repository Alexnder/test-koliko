import Fastify from 'fastify'
import pool from './db'

const fastify = Fastify({
  logger: true
})

type Item = {
  market_hash_name: string,
  currency: string,
  suggested_price: number,
  item_page: number,
  market_page: number,
  min_price: number,
  max_price: number,
  mean_price: number,
  quantity: number,
  created_at: number,
  updated_at: number
};

type ResultItem = Item & {
  min_tradable_price?: number,
}
type Cache = {
  skinport?: ResultItem[]
};

// TODO: redis
const cache: Cache = {};

fastify.get('/skinport', async function handler (request, reply) {

  if (cache.skinport) {
    return cache.skinport;
  }
  
  const items: Item[] = await fetch(`https://api.skinport.com/v1/items`).then((res) => res.json());


  const tradableItems: Item[] = await fetch(`https://api.skinport.com/v1/items?tradable=true`).then((res) => res.json());

  const resultsItems: ResultItem[] = items.map(item => {
    return {
      ...item,
      min_tradable_price: tradableItems.find(tradable => tradable.market_hash_name == item.market_hash_name)?.min_price
    }
  })

  cache.skinport = resultsItems

  return resultsItems;
})

type DeductBody = {
  userId: number
  amount: number
};

const deductJsonSchema = {
  type: 'object',
  required: ['userId', 'amount'],
  properties: {
    userId: { type: 'number' },
    amount: { type: 'number' },
  },
}

const schema = {
  body: deductJsonSchema,
}

fastify.post('/deduct', { schema }, async (request, reply) => {
  const deduction = request.body as DeductBody
  const users = await pool.query('SELECT * FROM users')
  const result = await pool.query('UPDATE users SET balance = balance - $1 WHERE balance - $1 >= 0 and id = $2', [Math.round(deduction.amount * 100), deduction.userId])
  return { success: result.rowCount! > 0 }
})

// Run the server!
async function run() {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

run();