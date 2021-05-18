import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { ip_address } = req.query
  try {
    if (!ip_address) {
      return res.status(400).json({ message: '`ip_address` required' })
    }
    if (typeof parseInt(ip_address.toString()) !== 'number') {
      return res.status(400).json({ message: '`ip_address` must be a number' })
    }
    const results = await query(
      `
      SELECT client_ip_address, client_bsc_address, timestamp
      FROM rugpull_faucet_users
      WHERE client_ip_address = ?
    `,
      ip_address
    )

    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
