import React from 'react';
import { Eye, User, Calendar, Pill, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuotes } from '../hooks/useQuotes';
import Toast from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { signOut } = useAuth();
  const { quote } = useQuotes();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: 'Dashboard', icon: Eye, key: 'dashboard' },
    { name: 'Appointments', icon: Calendar, key: 'appointments' },
    { name: 'Medications', icon: Pill, key: 'medications' },
    { name: 'Profile', icon: User, key: 'profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans transition-colors duration-500">
      <Toast />
      
      {/* Sticky Header & Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Opti Track
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate?.(item.key)}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-2xl transition-all duration-300 font-semibold ${
                      isActive
                        ? 'bg-teal-400/10 text-teal-400 shadow-inner'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : ''}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-5 py-2 text-gray-500 dark:text-gray-400 font-semibold bg-gray-200/50 dark:bg-slate-800/80 rounded-2xl hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quote & Mobile Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic opacity-80">"{quote}"</p>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around p-2 border-t border-gray-200/50 dark:border-slate-700/50">
            {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate?.(item.key)}
                    className={`flex flex-col items-center space-y-1 w-full py-1 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-teal-400/10 text-teal-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </button>
                );
              })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;