import express from 'express';
import { supabase } from '../server.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { full_name, phone_number } = req.body;
    
    const { data, error } = await supabase
      .from('user_info')
      .update({ full_name, phone_number })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;