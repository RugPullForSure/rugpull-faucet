import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { ip_address, bsc_address, timestamp } = req.body
  try {
    if (!ip_address || !bsc_address || !timestamp) {
      return res
        .status(400)
        .json({ message: '`ip_address` `bsc_address` and `timestamp` are all required' })
    }

    const results = await query(
      `
      INSERT INTO rugpull_faucet_users (ip_address, bsc_address, timestamp)
      VALUES (?, ?)
      `
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
