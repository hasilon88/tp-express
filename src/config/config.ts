import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  CERT_KEY: process.env.CERT_KEY_PATH,
  CERT_CERT: process.env.CERT_CERT_PATH,
  SECRET_KEY: process.env.SECURITY_SECRET_KEY || "SECRET_KEY",
  ENV: process.env.NODE_ENV || 'development',
  DATA_PATH: process.env.DATA_PATH || path.resolve(__dirname, '../data/data.json')
};