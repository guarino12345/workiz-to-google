import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

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

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid account ID' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    switch (req.method) {
      case 'GET':
        const account = await db.collection('accounts').findOne({ _id: new ObjectId(id) });
        if (!account) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(account);
        break;

      case 'PUT':
        const { name, apiKey, companyId } = req.body;
        if (!name || !apiKey || !companyId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.collection('accounts').findOneAndUpdate(
          { _id: new ObjectId(id) },
          {
            $set: {
              name,
              apiKey,
              companyId,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        );

        if (!result || !result.value) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(result.value);
        break;

      case 'DELETE':
        const deleteResult = await db.collection('accounts').deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(204).end();
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling account:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
} 