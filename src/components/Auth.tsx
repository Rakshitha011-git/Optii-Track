import React, { useState } from 'react';
import { Eye, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// We define the possible states for our form
type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

const Auth: React.FC = () => {
  // State to manage which form view is active (signIn, signUp, or forgotPassword)
  const [mode, setMode] = useState<AuthMode>('signIn');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // New state to show a success message (e.g., after sending a reset link)
  const [message, setMessage] = useState('');
  
  const { signIn, signUp, sendPasswordResetEmail } = useAuth();

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    // Clear all fields and messages when switching modes
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signUp') {
        const result = await signUp(email, password, fullName);
        if (result.error) setError(result.error.message);
      } else if (mode === 'signIn') {
        const result = await signIn(email, password);
        if (result.error) setError(result.error.message);
      } else if (mode === 'forgotPassword') {
        // This is the new logic for handling the password reset
        const result = await sendPasswordResetEmail(email);
        if (result.error) {
          setError(result.error.message);
        } else {
          setMessage('Password reset link sent! Please check your email inbox.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // A helper function to get the right title for the card
  const getTitle = () => {
    if (mode === 'signUp') return 'Create Account';
    if (mode === 'forgotPassword') return 'Reset Password';
    return 'Welcome Back';
  };

  const getSubtitle = () => {
    if (mode === 'signUp') return 'Start managing your eye care today';
    if (mode === 'forgotPassword') return 'Enter your email to receive a reset link';
    return 'Sign in to your account';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Opti Track
          </h1>
          <p className="text-gray-600 mt-2">Track Your Vision Effortlessly</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{getTitle()}</h2>
            <p className="text-gray-600 mt-2">{getSubtitle()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Conditional rendering for the Forgot Password success message */}
            {message && !error && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}
            
            {/* Show Full Name field only in Sign Up mode */}
            {mode === 'signUp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your full name" required />
                </div>
              </div>
            )}

            {/* Show Email field in all modes */}
            {mode !== 'signIn' || !message ? ( // Hide email input after success
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your email" required />
                    </div>
                </div>
            ) : null}

            {/* Show Password field only in Sign In and Sign Up modes */}
            {(mode === 'signIn' || mode === 'signUp') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    {/* THIS IS THE NEW FORGOT PASSWORD LINK */}
                    {mode === 'signIn' && (
                        <button type="button" onClick={() => handleModeChange('forgotPassword')} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Forgot Password?
                        </button>
                    )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter your password" required minLength={6} />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Don't show the main button if a success message is displayed */}
            {!message && (
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                    {loading ? 'Loading...' : (mode === 'signUp' ? 'Create Account' : (mode === 'forgotPassword' ? 'Send Reset Link' : 'Sign In'))}
                </button>
            )}
          </form>

          <div className="mt-6 text-center">
             {mode === 'forgotPassword' ? (
                <button onClick={() => handleModeChange('signIn')} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center justify-center w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                </button>
             ) : (
                <button onClick={() => handleModeChange(mode === 'signIn' ? 'signUp' : 'signIn')} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    {mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

