import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../apiConfig'; // Adjust the path if necessary

// Note: Framer Motion would be needed for more advanced animations,
// but for now, we'll use CSS transitions for smooth effects.

interface Appointment {
  appointment_id: number;
  last_checkup_date?: string;
  next_appointment_date: string;
  notes?: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    last_checkup_date: '',
    next_appointment_date: '',
    notes: '',
  });
  const { session } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  const fetchAppointments = async () => {
    if (!session) return;

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const url = editingId 
  ? `${API_URL}/api/appointments/${editingId}`
  : `${API_URL}/api/appointments`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAppointments();
        setShowForm(false);
        setEditingId(null);
        setFormData({ last_checkup_date: '', next_appointment_date: '', notes: '' });
      }
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      last_checkup_date: appointment.last_checkup_date?.split('T')[0] || '',
      next_appointment_date: appointment.next_appointment_date.split('T')[0],
      notes: appointment.notes || '',
    });
    setEditingId(appointment.appointment_id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!session || !confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ last_checkup_date: '', next_appointment_date: '', notes: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans text-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Appointments</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">Manage your eye care schedule.</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-2xl hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-teal-400/40"
        >
          <Plus className="w-6 h-6" />
          <span className="font-semibold">New Appointment</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full p-8 transition-transform transform scale-95 hover:scale-100 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Appointment' : 'New Appointment'}
              </h3>
              <button onClick={cancelForm} className="text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Last Checkup Date
                </label>
                <input
                  type="date"
                  value={formData.last_checkup_date}
                  onChange={(e) => setFormData({ ...formData, last_checkup_date: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:shadow-[0_0_15px_rgba(0,199,183,0.5)] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Next Appointment Date *
                </label>
                <input
                  type="date"
                  value={formData.next_appointment_date}
                  onChange={(e) => setFormData({ ...formData, next_appointment_date: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:shadow-[0_0_15px_rgba(0,199,183,0.5)] transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:shadow-[0_0_15px_rgba(0,199,183,0.5)] transition-all duration-300"
                  placeholder="e.g., Follow-up for prescription check..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 py-3 border-2 border-slate-400 dark:border-slate-500 rounded-2xl text-gray-700 dark:text-gray-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
        <div className="px-8 py-5 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Schedule</h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {appointments.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments scheduled.</p>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Add a new appointment to see it here.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.appointment_id} className="p-6 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-8 mb-3">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">NEXT APPOINTMENT</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {new Date(appointment.next_appointment_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      
                      {appointment.last_checkup_date && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">LAST CHECKUP</p>
                          <p className="text-lg text-gray-700 dark:text-gray-300">
                            {new Date(appointment.last_checkup_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {appointment.notes && (
                      <p className="text-base text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">{appointment.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-full transition-all duration-200"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.appointment_id)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-slate-600 rounded-full transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;