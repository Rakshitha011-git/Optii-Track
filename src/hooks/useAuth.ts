import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// This hook is now a helper for our AuthContext and not used directly in components
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };
  

  const sendPasswordResetEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // IMPORTANT CHANGE: Point to the new reset page
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  // NEW FUNCTION: To update the user's password
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    return { data, error };
  };


  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updatePassword, // Export the new function
  };
};