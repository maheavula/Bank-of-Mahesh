import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SESSION_SECRET: process.env.SESSION_SECRET || 'bank_of_mahesh_super_secret_session_key_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SESSION_IDLE_MINUTES: parseInt(process.env.SESSION_IDLE_MINUTES || '5', 10),
  DATA_FILE_PATH: process.env.DATA_FILE_PATH || path.resolve(__dirname, '../../data/runtime.json')
};
