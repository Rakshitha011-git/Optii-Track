/*
  # Opti Track Database Schema

  1. New Tables
    - `user_info` - Stores extended user profile information
      - `id` (uuid, primary key, references auth.users.id)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone_number` (text, nullable)
      - `created_at` (timestamp)
    
    - `appointments` - Manages eye care appointments
      - `appointment_id` (bigserial, primary key)
      - `user_id` (uuid, foreign key to user_info.id)
      - `last_checkup_date` (date, nullable)
      - `next_appointment_date` (date)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
    
    - `eye_drop_schedules` - Manages medication schedules
      - `schedule_id` (bigserial, primary key)
      - `user_id` (uuid, foreign key to user_info.id)
      - `medication_name` (text)
      - `frequency` (integer)
      - `times_of_day` (text array)
      - `notes` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data only
    
  3. Database Trigger
    - Auto-sync new users from auth.users to user_info table
*/

-- Create user_info table
CREATE TABLE IF NOT EXISTS user_info (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
  last_checkup_date date,
  next_appointment_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create eye_drop_schedules table
CREATE TABLE IF NOT EXISTS eye_drop_schedules (
  schedule_id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  frequency integer NOT NULL DEFAULT 1,
  times_of_day text[] NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE eye_drop_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_info
CREATE POLICY "Users can read own profile"
  ON user_info
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_info
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for appointments
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for eye_drop_schedules
CREATE POLICY "Users can read own schedules"
  ON eye_drop_schedules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON eye_drop_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON eye_drop_schedules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON eye_drop_schedules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger function to sync auth.users with user_info
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_info (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();