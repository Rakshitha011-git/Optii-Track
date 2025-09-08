import React, { useState, useEffect } from 'react';
import { Pill, Plus, Edit2, Trash2, Save, X, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../apiConfig'; // Adjust the path if necessary

interface Schedule {
  schedule_id: number;
  medication_name: string;
  frequency: number;
  times_of_day: string[];
  notes?: string;
}

const Medications: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    medication_name: '',
    frequency: 1,
    times_of_day: [''],
    notes: '',
  });
  const { session } = useAuth();

  useEffect(() => {
    fetchSchedules();
  }, [session]);

  const fetchSchedules = async () => {
    if (!session) return;

    try {
      const response = await fetch('${API_URL}/api/schedules', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const validTimes = formData.times_of_day.filter(time => time !== '');
    
    try {
      const url = editingId 
        ? `${API_URL}/api/schedules/${editingId}`
        : '${API_URL}/api/schedules';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          times_of_day: validTimes,
        }),
      });

      if (response.ok) {
        fetchSchedules();
        cancelForm();
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setFormData({
      medication_name: schedule.medication_name,
      frequency: schedule.frequency,
      times_of_day: [...schedule.times_of_day, ''],
      notes: schedule.notes || '',
    });
    setEditingId(schedule.schedule_id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!session || !confirm('Are you sure you want to delete this medication schedule?')) return;

    try {
      const response = await fetch(`${API_URL}/api/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      times_of_day: [...formData.times_of_day, ''],
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = formData.times_of_day.filter((_, i) => i !== index);
    setFormData({ ...formData, times_of_day: newTimes });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.times_of_day];
    newTimes[index] = value;
    setFormData({ ...formData, times_of_day: newTimes });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      medication_name: '',
      frequency: 1,
      times_of_day: [''],
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Medication Schedule</h2>
          <p className="text-gray-600 mt-1">Manage your eye drop reminders</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Medication' : 'New Medication'}
              </h3>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={formData.medication_name}
                  onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Latanoprost Eye Drops"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={1}>Once daily</option>
                  <option value={2}>Twice daily</option>
                  <option value={3}>Three times daily</option>
                  <option value={4}>Four times daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Times of Day *
                </label>
                <div className="space-y-2">
                  {formData.times_of_day.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={index < formData.frequency}
                      />
                      {formData.times_of_day.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {formData.times_of_day.length < 6 && (
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add another time
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Special instructions or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="grid gap-6">
        {schedules.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No medications yet</h3>
            <p className="text-gray-500 mb-6">Add your first eye drop schedule to get started with reminders</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
            >
              Add Your First Medication
            </button>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.schedule_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {schedule.medication_name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {schedule.frequency} time{schedule.frequency > 1 ? 's' : ''} daily
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {schedule.times_of_day.map((time, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                  
                  {schedule.notes && (
                    <p className="text-sm text-gray-600">{schedule.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.schedule_id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;