import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { WorkizService } from '../services/workiz/workizService';
import { SheetsService } from '../services/sheets/sheetsService';

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
      const workizService = new WorkizService(account.workizApiKey);
      const sheetsService = new SheetsService(
        JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS!),
        account.googleSheetsId
      );

      // Get jobs from the last 14 days
      const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const jobs = await workizService.getAllJobs(startDate);
      
      // Filter jobs by source if specified
      const filteredJobs = account.sources 
        ? jobs.filter(job => account.sources.includes(job.JobSource))
        : jobs;

      // Clear existing data and append new jobs
      await sheetsService.clearSheet();
      await sheetsService.appendJobs(filteredJobs);

      // Log the sync
      await db.collection('sync_logs').insertOne({
        accountId: account.accountId,
        timestamp: new Date(),
        jobsProcessed: filteredJobs.length,
        status: 'success'
      });
    }

    await client.close();
    return res.status(200).json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 