import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './modules/auth/authRoutes.js';
import propertyRoutes from './modules/properties/propertyRoutes.js';
import landlordRoutes from './modules/landlords/landlordRoutes.js';
import tenantRoutes from './modules/tenants/tenantRoutes.js';
import rentRoutes from './modules/rent/rentRoutes.js';
import maintenanceRoutes from './modules/maintenance/maintenanceRoutes.js';
import taskRoutes from './modules/tasks/taskRoutes.js';
import whatsappRoutes from './modules/whatsapp/whatsappRoutes.js';
import discoveryRoutes from './modules/discovery/discoveryRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend and external webhooks
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Info
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Locari Property Management Operating System (Central Backend)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/webhook', whatsappRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/landlords', landlordRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/discovery', discoveryRoutes);

// Serve frontend production build if available
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.includes(path.sep + 'assets' + path.sep) || filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/webhook') || req.path === '/health') {
      return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Start Server
app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Locari Property Management Backend Live on Port ${config.port}`);
  console.log(`📱 WhatsApp BotSailor Webhook: http://localhost:${config.port}/webhook/botsailor`);
  console.log(`🌐 Health Check:              http://localhost:${config.port}/health`);
  console.log(`=======================================================`);
});

export default app;
