import React,{ useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// This is the new component for the password reset form
const ResetPassword = () => {
    const { updatePassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if the two passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        // Call the updatePassword function from our auth hook
        const { error: updateError } = await updatePassword(newPassword);

        if (updateError) {
            setError(updateError.message);
        } else {
            setMessage("Your password has been reset successfully! You can now sign in.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Choose a New Password
                </h2>
                
                {/* Show a success message if the password was changed */}
                {message ? (
                    <div className="text-center">
                        <p className="text-green-600 mb-4">{message}</p>
                        <a href="/" className="text-blue-600 hover:underline">
                            Go to Sign In
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;