import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db();
    
    // Get all configured accounts
    const accounts = await db.collection('accounts').find({}).toArray();
    
    // Process each account
    for (const account of accounts) {
      // TODO: Implement Workiz API integration
      // TODO: Implement Google Sheets integration
      console.log(`Processing account: ${account.accountId}`);
    }

    await client.close();
    return res.status(200).json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 