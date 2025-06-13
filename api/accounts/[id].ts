import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    switch (req.method) {
      case 'GET':
        const account = await db.collection('accounts').findOne({ _id: new ObjectId(id as string) });
        if (!account) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(account);
        break;

      case 'PUT':
        const { name, apiKey, companyId } = req.body;
        const result = await db.collection('accounts').updateOne(
          { _id: new ObjectId(id as string) },
          { $set: { name, apiKey, companyId, updatedAt: new Date() } }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: 'Account updated successfully' });
        break;

      case 'DELETE':
        const deleteResult = await db.collection('accounts').deleteOne({ _id: new ObjectId(id as string) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
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