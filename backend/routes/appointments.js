import express from 'express';
import { supabase } from '../server.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all appointments for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('next_appointment_date', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create new appointment
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { last_checkup_date, next_appointment_date, notes } = req.body;
    
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: req.user.id,
        last_checkup_date,
        next_appointment_date,
        notes
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { last_checkup_date, next_appointment_date, notes } = req.body;
    
    const { data, error } = await supabase
      .from('appointments')
      .update({ last_checkup_date, next_appointment_date, notes })
      .eq('appointment_id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('appointment_id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;