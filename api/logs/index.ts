import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    const logs = await db.collection('sync_logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 