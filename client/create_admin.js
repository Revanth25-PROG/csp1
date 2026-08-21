import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  const email = 'admin@admin.com';
  const password = 'admin@12345';

  console.log(`Creating admin account with email: ${email} ...`);

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: 'Super Admin',
        role: 'admin' // Setting the admin role!
      }
    }
  });

  if (error) {
    console.error('❌ Failed to create admin:', error.message);
  } else {
    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('You can now log in on the /admin-login page.');
  }
}

createAdmin();
