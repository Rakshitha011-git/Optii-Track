export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Now use this API_URL variable for all your fetch requests
export const fetchNotifications = async () => {
  const response = await fetch(`${API_URL}/api/notifications`);
  // ... rest of your code
};