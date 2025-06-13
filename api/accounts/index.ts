import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    switch (req.method) {
      case 'GET':
        const accounts = await db.collection('accounts').find({}).toArray();
        res.status(200).json(accounts);
        break;

      case 'POST':
        const newAccount = req.body;
        await db.collection('accounts').insertOne(newAccount);
        res.status(201).json(newAccount);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 