import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // LAB ONLY: intentionally committed secret for the hardcoded-secret exercise.
  SESSION_SECRET: 'amr-lab-session-secret-do-not-use-in-production',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  // LAB ONLY: seven-day idle window models an unsafe long-lived session.
  SESSION_IDLE_MINUTES: parseInt(process.env.SESSION_IDLE_MINUTES || '10080', 10),
  DATA_FILE_PATH: process.env.DATA_FILE_PATH || path.resolve(__dirname, '../../data/runtime.json')
};
