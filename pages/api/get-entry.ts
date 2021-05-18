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
    const results = await getEntry(ip_address);
    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export async function getEntry(ip_address) {
  console.log("IP Address being fed to getEntry:",ip_address);
  const results = await query(
  `SELECT INET_NTOA(client_ip_address) AS ip_address, client_bsc_address
    FROM rugpull_faucet_users
    WHERE INET_NTOA(client_ip_address) = ?`,
    ip_address
  )
  console.log("getEntry results:",results);
  return results;
}

export default handler
