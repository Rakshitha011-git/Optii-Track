# Opti Track - Eye Care Management Application

A comprehensive full-stack web application to help users manage eye care appointments and medication schedules effortlessly.

## Features

- **Authentication & User Profiles**: Secure email/password authentication with Supabase
- **Dashboard**: Overview of today's medications and upcoming appointments
- **Appointment Management**: Track past and future eye care appointments
- **Medication Scheduling**: Manage eye drop schedules with custom timing
- **In-App Notifications**: Real-time reminders for medications and appointments
- **Responsive Design**: Works beautifully on all devices

## Technology Stack

- **Frontend**: React with Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js with scheduled cron jobs
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth

## Project Structure

```
opti-track/
├── backend/                 # Express.js API server
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication middleware
│   ├── cron/              # Scheduled background jobs
│   └── server.js          # Main server file
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── App.tsx            # Main app component
├── supabase/
│   └── migrations/        # Database schema migrations
└── README.md
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and anon key
3. Run the database migration:
   - In your Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/create_schema.sql`
   - Run the migration to create tables and set up RLS policies

### 2. Environment Variables

Create `.env` files in both root and backend directories:

**Root `.env`:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend `.env`:**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3. Installation & Development

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Start the development servers:

**Frontend (Terminal 1):**
```bash
npm run dev
```

**Backend API (Terminal 2):**
```bash
cd backend
npm run dev
```

**Background Jobs (Terminal 3):**
```bash
cd backend
npm run cron
```

### 4. Database Authentication Setup

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Disable "Enable email confirmations" for development
3. Set "Site URL" to your frontend URL (http://localhost:5173 for development)

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service
3. Set environment variables in your hosting dashboard

### Backend Deployment

Deploy the backend to a service like Railway, Render, or Heroku:

1. Set up the environment variables
2. Deploy the backend folder
3. Set up a separate cron job service or use the platform's scheduling features

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Dashboard**: View today's medication schedule and upcoming appointments
3. **Medications**: Add and manage eye drop schedules with custom timing
4. **Appointments**: Track past checkups and schedule future appointments
5. **Profile**: Update your personal information and contact details

## API Endpoints

### Authentication
- All endpoints require Bearer token authorization

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Medication Schedules
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Notifications
- `GET /api/notifications` - Get pending notifications

## Security Features

- Row Level Security (RLS) enabled on all tables
- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.