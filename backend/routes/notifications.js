import express from 'express';
import { supabase } from '../server.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get pending notifications for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDate = now.toISOString().split('T')[0];

    // Get medication reminders
    const { data: schedules, error: scheduleError } = await supabase
      .from('eye_drop_schedules')
      .select('*')
      .eq('user_id', req.user.id);

    if (scheduleError) {
      return res.status(400).json({ error: scheduleError.message });
    }

    // Get appointment reminders (within next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('next_appointment_date', currentDate)
      .lte('next_appointment_date', nextWeek.toISOString().split('T')[0]);

    if (appointmentError) {
      return res.status(400).json({ error: appointmentError.message });
    }

    const notifications = [];

    // Check for medication reminders
    schedules.forEach(schedule => {
      schedule.times_of_day.forEach(time => {
        if (time === currentTime) {
          notifications.push({
            type: 'medication',
            title: 'Medication Reminder',
            message: `Time to take ${schedule.medication_name}`,
            timestamp: now.toISOString()
          });
        }
      });
    });

    // Check for appointment reminders
    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.next_appointment_date);
      const daysUntil = Math.ceil((appointmentDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 1) {
        notifications.push({
          type: 'appointment',
          title: 'Appointment Reminder',
          message: `Eye appointment ${daysUntil === 0 ? 'today' : 'tomorrow'}`,
          timestamp: now.toISOString()
        });
      }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;