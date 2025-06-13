import axios from 'axios';
import { WorkizApiResponse, WorkizJob } from './types';

export class WorkizService {
  private apiKey: string;
  private baseUrl = 'https://api.workiz.com/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getJobs(startDate: string, offset = 0, records = 100): Promise<WorkizApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.apiKey}/job/all/`, {
        params: {
          start_date: startDate,
          offset,
          records,
          only_open: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Workiz jobs:', error);
      throw error;
    }
  }

  async getJobDetails(uuid: string): Promise<WorkizJob> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.apiKey}/job/get/${uuid}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Workiz job details for ${uuid}:`, error);
      throw error;
    }
  }

  async getAllJobs(startDate: string): Promise<WorkizJob[]> {
    let allJobs: WorkizJob[] = [];
    let offset = 0;
    let hasMore = true;
    const records = 100;

    while (hasMore) {
      const response = await this.getJobs(startDate, offset, records);
      allJobs = [...allJobs, ...response.data];
      
      hasMore = response.has_more;
      offset += records;
    }

    return allJobs;
  }
} 