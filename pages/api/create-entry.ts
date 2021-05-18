import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { ip_address, bsc_address} = req.body
  try {
    if (!ip_address || !bsc_address) {
      return res
        .status(400)
        .json({ message: '`ip_address` and `bsc_address` are both required' })
    }
    const results = await addUser(ip_address,bsc_address);
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export async function addUser(ip_address,bsc_address){
  
  const results = await query(
    `
    INSERT INTO rugpull_faucet_users (client_ip_address, client_bsc_address, timestamp)
    VALUES (INET_ATON(?), ?, UNIX_TIMESTAMP())
    `,[ip_address,bsc_address]
  )

  return results;
}

export default handler
