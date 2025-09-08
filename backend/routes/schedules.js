import express from 'express';
import { supabase } from '../server.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all schedules for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('eye_drop_schedules')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create new schedule
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { medication_name, frequency, times_of_day, notes } = req.body;
    
    const { data, error } = await supabase
      .from('eye_drop_schedules')
      .insert({
        user_id: req.user.id,
        medication_name,
        frequency,
        times_of_day,
        notes
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Update schedule
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { medication_name, frequency, times_of_day, notes } = req.body;
    
    const { data, error } = await supabase
      .from('eye_drop_schedules')
      .update({ medication_name, frequency, times_of_day, notes })
      .eq('schedule_id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// Delete schedule
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('eye_drop_schedules')
      .delete()
      .eq('schedule_id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;