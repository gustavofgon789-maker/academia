import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import vehicleAdminRoutes from './routes/vehicleAdmin.routes';
import imageRoutes from './routes/image.routes';
import leadRoutes from './routes/lead.routes';
import { settingsPublicRouter, settingsAdminRouter } from './routes/settings.routes';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin/vehicles', vehicleAdminRoutes);
app.use('/api/admin', imageRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/site-settings', settingsPublicRouter);
app.use('/api/admin/site-settings', settingsAdminRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
