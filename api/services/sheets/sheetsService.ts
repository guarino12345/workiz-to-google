import { google } from 'googleapis';
import { WorkizJob } from '../workiz/types';

export class SheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor(credentials: any, spreadsheetId: string) {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  async appendJobs(jobs: WorkizJob[], sheetName: string = 'Jobs') {
    const values = jobs.map(job => [
      job.UUID,
      job.Status,
      job.JobSource,
      job.CreatedDate,
      job.LastStatusUpdate,
      `${job.FirstName} ${job.LastName}`.trim(),
      job.Email,
      job.Phone,
      job.JobTotalPrice,
      job.JobAmountDue,
      job.JobType,
      job.JobNotes,
      job.Address,
      job.City,
      job.State,
      job.PostalCode
    ]);

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:P`,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      });
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }

  async clearSheet(sheetName: string = 'Jobs') {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:P`
      });
    } catch (error) {
      console.error('Error clearing Google Sheet:', error);
      throw error;
    }
  }
} 