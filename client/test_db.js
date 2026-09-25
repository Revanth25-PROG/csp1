import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasePublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

async function testDatabase() {
  console.log("Testing connection to Supabase...");
  
  // Try to fetch complaints to see if table exists and is readable
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error("Database connection failed or table 'complaints' does not exist.");
    console.error("Error details:", error.message);
    process.exit(1);
  }
  
  console.log("✅ Successfully connected to Supabase!");
  console.log("✅ The 'complaints' table exists and is accessible.");
  console.log("Current rows in 'complaints':", data.length);
  
  // Test storage bucket
  const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
  if (storageError) {
    console.error("❌ Failed to fetch storage buckets:", storageError.message);
  } else {
    const hasBucket = buckets.some(b => b.name === 'complaint-photos');
    if (hasBucket) {
      console.log("✅ The 'complaint-photos' storage bucket exists.");
    } else {
      console.warn("⚠️ The 'complaint-photos' storage bucket DOES NOT exist yet.");
    }
  }
}

testDatabase();
