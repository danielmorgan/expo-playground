import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  'https://voxqqcsxwckijepmkxsw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveHFxY3N4d2NraWplcG1reHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODA1NjksImV4cCI6MjA1Mjg1NjU2OX0.J--6f2FCL6obRC9ebHLIRWWka4a7z19UBmRwEeyzCy8'
);
