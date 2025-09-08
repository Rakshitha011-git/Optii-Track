import React, { useState, useEffect } from 'react';
import { Calendar, Pill, Plus, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../apiConfig'; // Adjust the path if necessary

interface Schedule {
  schedule_id: number;
  medication_name: string;
  times_of_day: string[];
  frequency: number;
}

interface Appointment {
  appointment_id: number;
  next_appointment_date: string;
  notes?: string;
}

const Dashboard: React.FC = () => {
  const [todaySchedule, setTodaySchedule] = useState<Schedule[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    if (!session) return;

    try {
      // Fetch medication schedules
      const scheduleResponse = await fetch('${API_URL}/api/schedules', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (scheduleResponse.ok) {
        const schedules = await scheduleResponse.json();
        setTodaySchedule(schedules);
      }

      // Fetch next appointment
      const appointmentResponse = await fetch('${API_URL}/api/appointments', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (appointmentResponse.ok) {
        const appointments = await appointmentResponse.json();
        if (appointments.length > 0) {
          setNextAppointment(appointments[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeStatus = (times: string[]) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const nextTime = times.find(time => time > currentTime) || times[0];
    const isPending = times.includes(currentTime);
    
    return { nextTime, isPending };
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h2>
        <p className="text-gray-600">Stay on top of your eye care routine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Pill className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Today's Medications</h3>
            </div>
          </div>
          
          <div className="p-6">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No medications scheduled</p>
                <p className="text-sm text-gray-400 mt-1">Add your eye drop schedule to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.map((schedule) => {
                  const { nextTime, isPending } = getCurrentTimeStatus(schedule.times_of_day);
                  
                  return (
                    <div
                      key={schedule.schedule_id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        isPending 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{schedule.medication_name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {isPending ? 'Take now!' : `Next: ${nextTime}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {schedule.times_of_day.map((time, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  time === nextTime
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {isPending && (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Next Appointment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Next Appointment</h3>
            </div>
          </div>
          
          <div className="p-6">
            {!nextAppointment ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
                <p className="text-sm text-gray-400 mt-1">Schedule your next eye checkup</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Date</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(nextAppointment.next_appointment_date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Days Until</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {Math.ceil(
                      (new Date(nextAppointment.next_appointment_date).getTime() - new Date().getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )} days
                  </span>
                </div>

                {nextAppointment.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Notes</span>
                    <p className="text-sm text-gray-700 mt-1">{nextAppointment.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Book Appointment</p>
              <p className="text-sm text-gray-500">Schedule your next checkup</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 group">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
              <Plus className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Medication</p>
              <p className="text-sm text-gray-500">Set up eye drop reminders</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;