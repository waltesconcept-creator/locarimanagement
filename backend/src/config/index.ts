import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'locari_pm_super_secret_key_2026',
  
  // WhatsApp & BotSailor settings
  botsailor: {
    webhookSecret: process.env.BOTSAILOR_WEBHOOK_SECRET || 'locari_botsailor_secret',
    apiEndpoint: process.env.BOTSAILOR_API_ENDPOINT || 'https://api.botsailor.com/v1',
    botId: process.env.BOTSAILOR_BOT_ID || '',
  },
  
  // Meta Cloud API fallback
  metaWhatsApp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'locari_verify_secret',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },

  // Locari Rental Discovery Modular API
  locariDiscovery: {
    apiUrl: process.env.LOCARI_DISCOVERY_API_URL || 'https://locari.africa/api/listings',
    apiKey: process.env.LOCARI_DISCOVERY_API_KEY || 'locari_discovery_test_key',
  },

  // Supabase / Database
  databaseUrl: process.env.DATABASE_URL || '',
};
