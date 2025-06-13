# Workiz-Google Sheets Integration

A service that syncs Workiz job data with Google Sheets for Google Ads conversion tracking and reporting.

## Overview

This service automatically synchronizes Workiz job data with Google Sheets, enabling efficient conversion tracking and reporting for Google Ads campaigns. It supports multiple Workiz accounts with different configurations and provides a simple dashboard for monitoring and reporting.

## Features

- 🔄 Daily sync of Workiz jobs
- 📊 Initial sync of recent jobs (last 14 days)
- 🎯 Source-based job filtering (e.g., Orlando, Tampa)
- 💰 Default conversion value per account
- 👥 Multiple Workiz account support
- 📈 Job status tracking and updates
- 📊 Simple dashboard with reports and logs
- 🔄 Manual sync trigger

## Technical Stack

### Backend

- Node.js/TypeScript
- Express.js (API server)
- Vercel Serverless Functions
- Vercel Cron Jobs (for scheduling)

### Frontend

- React.js
- Material-UI
- Chart.js for reports

### Storage & Integration

- Google Sheets API
- Workiz API
- MongoDB (for account management)

### Infrastructure

- Vercel (API hosting and serverless functions)
- MongoDB Atlas (database hosting)

## Project Structure

```
├── api/                    # API routes and serverless functions
│   ├── webhooks/          # Webhook handlers
│   └── jobs/              # Job-related endpoints
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── services/          # Business logic
│   │   ├── workiz/       # Workiz API integration
│   │   ├── sheets/       # Google Sheets integration
│   │   └── sync/         # Sync logic
│   ├── models/            # Data models
│   └── utils/             # Utility functions
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Reports/
│   │   │   └── Logs/
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
├── tests/                 # Test files
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Workiz API credentials
- Google Sheets API credentials
- Vercel account

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# Vercel
VERCEL_ENV=development

# Application
PORT=3000
NODE_ENV=development
```

### Account Configuration

Each Workiz account requires the following configuration in the database:

```json
{
  "accountId": "unique_account_id",
  "workizApiKey": "workiz_api_key",
  "workizWebhookSecret": "webhook_secret",
  "googleSheetsId": "spreadsheet_id",
  "sources": ["Orlando", "Tampa"],
  "defaultConversionValue": 100
}
```

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd workiz-google-sheets-integration
   ```

2. Install dependencies:

   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Run development server:
   ```bash
   # Backend
   npm run dev
   # Frontend
   cd frontend
   npm start
   ```

## Dashboard Features

### Reports Tab

- New jobs per day statistics
- Job status graph
- Revenue per month

### Logs Tab

- Timestamp of sync
- Number of jobs updated
- Number of new jobs added
- Any errors encountered
- API response times

### Controls Tab

- Manual sync trigger
- Account management
- Basic settings

## Deployment

The project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## API Documentation

### Endpoints

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/sync` - Trigger manual sync
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `POST /api/webhooks/workiz` - Workiz webhook endpoint

## Development Roadmap

### Phase 1: Foundation

- [ ] Set up project structure
- [ ] Implement Workiz API integration
- [ ] Create basic job polling mechanism
- [ ] Set up Vercel Cron Jobs

### Phase 2: Core Features

- [ ] Implement Google Sheets integration
- [ ] Add source-based filtering
- [ ] Create default conversion value system
- [ ] Build basic error handling
- [ ] Implement initial 14-day sync

### Phase 3: Frontend Development

- [ ] Create basic dashboard layout
- [ ] Implement reports tab
- [ ] Add logs viewer
- [ ] Create controls interface

### Phase 4: Testing & Deployment

- [ ] Test with real Workiz data
- [ ] Implement logging and monitoring
- [ ] Deploy to production
- [ ] Document API and usage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
