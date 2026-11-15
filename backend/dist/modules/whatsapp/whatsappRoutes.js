import { Router } from 'express';
import { conversationalEngine } from './conversationalEngine.js';
import { BotSailorAdapter } from './botsailorAdapter.js';
import { config } from '../../config/index.js';
const router = Router();
/**
 * BotSailor Webhook Endpoint
 * Configure this in BotSailor -> Webhooks / HTTP API Card:
 * POST https://your-server.com/webhook/botsailor
 */
router.post('/botsailor', async (req, res) => {
    try {
        const inbound = BotSailorAdapter.normalizeInboundPayload(req.body);
        const outbound = await conversationalEngine.processIncomingMessage(inbound);
        const formatted = BotSailorAdapter.formatOutboundResponse(outbound);
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error('Error handling BotSailor webhook:', error);
        res.status(500).json({ status: '0', error: error.message });
    }
});
/**
 * Meta WhatsApp Cloud API Webhook Verification & Listener
 */
router.get('/meta', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === config.metaWhatsApp.verifyToken) {
            console.log('Meta WhatsApp Webhook Verified successfully.');
            return res.status(200).send(challenge);
        }
        else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
});
router.post('/meta', async (req, res) => {
    try {
        const entry = req.body?.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];
        if (message) {
            const fromPhone = message.from;
            const text = message.text?.body || '';
            const inbound = {
                fromPhone,
                messageText: text,
                platform: 'meta'
            };
            const outbound = await conversationalEngine.processIncomingMessage(inbound);
            // In production, outbound is dispatched via Meta Graph API /messages
            console.log(`[Meta Cloud WhatsApp Outbound to ${outbound.recipientPhone}]:`, outbound.responseText);
        }
        res.status(200).send('EVENT_RECEIVED');
    }
    catch (err) {
        console.error('Meta Webhook Error:', err);
        res.status(500).send(err.message);
    }
});
/**
 * Interactive WhatsApp Simulator Endpoint (for Web Dashboard testing)
 */
router.post('/simulate', async (req, res) => {
    try {
        const { fromPhone, messageText, senderName } = req.body;
        if (!fromPhone || !messageText) {
            return res.status(400).json({ error: 'fromPhone and messageText are required.' });
        }
        const inbound = {
            fromPhone: String(fromPhone),
            senderName: senderName || 'User',
            messageText: String(messageText),
            platform: 'simulator'
        };
        const outbound = await conversationalEngine.processIncomingMessage(inbound);
        res.status(200).json(outbound);
    }
    catch (error) {
        console.error('Simulator error:', error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
