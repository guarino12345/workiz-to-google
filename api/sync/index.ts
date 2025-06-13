import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';
import axios, { AxiosError } from 'axios';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountId } = req.body;
  if (!accountId) {
    return res.status(400).json({ error: 'Account ID is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  try {
    // Get account details
    const account = await db.collection('accounts').findOne({ _id: new ObjectId(accountId) });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Create sync log entry
    const syncLog = {
      accountId,
      timestamp: new Date(),
      status: 'in_progress',
      jobsProcessed: 0,
      error: null
    };
    const logResult = await db.collection('sync_logs').insertOne(syncLog);

    try {
      // Fetch jobs from Workiz
      const response = await axios.get('https://api.workiz.com/api/v1/jobs', {
        headers: {
          'Authorization': `Bearer ${account.apiKey}`,
          'Company-Id': account.companyId
        }
      });

      const jobs = response.data;
      const processedJobs = jobs.length;

      // Update sync log with success
      await db.collection('sync_logs').updateOne(
        { _id: logResult.insertedId },
        {
          $set: {
            status: 'completed',
            jobsProcessed: processedJobs,
            completedAt: new Date()
          }
        }
      );

      res.status(200).json({
        message: 'Sync completed successfully',
        jobsProcessed: processedJobs
      });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Unknown error occurred';

      // Update sync log with error
      await db.collection('sync_logs').updateOne(
        { _id: logResult.insertedId },
        {
          $set: {
            status: 'failed',
            error: errorMessage,
            completedAt: new Date()
          }
        }
      );

      throw error;
    }
  } catch (error) {
    console.error('Error during sync:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Sync failed', details: errorMessage });
  } finally {
    await client.close();
  }
} 