import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';

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

// Start Server
app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Locari Property Management Backend Live on Port ${config.port}`);
  console.log(`📱 WhatsApp BotSailor Webhook: http://localhost:${config.port}/webhook/botsailor`);
  console.log(`🌐 Health Check:              http://localhost:${config.port}/health`);
  console.log(`=======================================================`);
});

export default app;
