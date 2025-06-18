// Simple build script to ensure environment variables are properly loaded
import { execSync } from 'child_process';
import fs from 'fs';

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('Creating .env file from environment variables...');
  const envContent = `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL || 'https://jallgdeqxrzjqwmchskr.supabase.co'}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbGxnZGVxeHJ6anF3bWNoc2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTkyNzIsImV4cCI6MjA2NTM5NTI3Mn0.cfjUwziFrJqLKgsXWxxf3Inluqxts01uRRhKsjaDQ0o'}`;
  fs.writeFileSync('.env', envContent);
}

// Run the build command
console.log('Building the application...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}