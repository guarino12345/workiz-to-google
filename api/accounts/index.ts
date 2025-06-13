import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const API_KEY = process.env.API_KEY;

function authenticate(req: VercelRequest, res: VercelResponse): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  const token = authHeader.split(' ')[1];
  if (token !== API_KEY) {
    res.status(401).json({ error: 'Invalid API key' });
    return false;
  }

  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!authenticate(req, res)) {
    return;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    switch (req.method) {
      case 'GET':
        const accounts = await db.collection('accounts').find({}).toArray();
        res.status(200).json(accounts);
        break;

      case 'POST':
        const { name, apiKey, companyId } = req.body;
        if (!name || !apiKey || !companyId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.collection('accounts').insertOne({
          name,
          apiKey,
          companyId,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const newAccount = await db.collection('accounts').findOne({ _id: result.insertedId });
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