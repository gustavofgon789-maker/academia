import dotenv from 'dotenv';
dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  PORT: parseInt(process.env.PORT || '3333', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
