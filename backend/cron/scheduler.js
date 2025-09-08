import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Check for notifications every minute
cron.schedule('* * * * *', async () => {
  console.log('Checking for reminders...', new Date().toISOString());
  
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().split('T')[0];

    // Get all active medication schedules
    const { data: schedules } = await supabase
      .from('eye_drop_schedules')
      .select('*');

    // Get upcoming appointments (within 24 hours)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .gte('next_appointment_date', currentDate)
      .lte('next_appointment_date', tomorrow.toISOString().split('T')[0]);

    // Log medication reminders
    if (schedules) {
      schedules.forEach(schedule => {
        if (schedule.times_of_day.includes(currentTime)) {
          console.log(`Medication reminder: ${schedule.medication_name} for user ${schedule.user_id}`);
        }
      });
    }

    // Log appointment reminders
    if (appointments) {
      appointments.forEach(appointment => {
        console.log(`Appointment reminder for user ${appointment.user_id}`);
      });
    }

  } catch (error) {
    console.error('Cron job error:', error);
  }
});

console.log('Cron scheduler started');