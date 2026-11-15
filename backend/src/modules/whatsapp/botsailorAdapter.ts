import { InboundMessage, OutboundResponse, conversationalEngine } from './conversationalEngine.js';

export class BotSailorAdapter {
  /**
   * Translates incoming BotSailor JSON payload to standardized InboundMessage
   * BotSailor sends payloads with keys such as:
   * subscriber_phone / phone / wa_id / from
   * message / text / last_input
   */
  static normalizeInboundPayload(body: any): InboundMessage {
    const fromPhone = 
      body.subscriber_phone ||
      body.phone ||
      body.wa_id ||
      body.sender ||
      body.from ||
      body.contact?.phone ||
      '+2348000000000';

    const senderName =
      body.subscriber_name ||
      body.name ||
      body.first_name ||
      body.contact?.name ||
      '';

    const messageText =
      body.message ||
      body.text ||
      body.last_input ||
      body.user_input ||
      body.query ||
      '';

    return {
      fromPhone: String(fromPhone),
      senderName: String(senderName),
      messageText: String(messageText),
      mediaUrl: body.media_url,
      platform: 'botsailor'
    };
  }

  /**
   * Formats internal response into BotSailor HTTP API response shape
   */
  static formatOutboundResponse(response: OutboundResponse): Record<string, any> {
    return {
      status: '1',
      recipient_phone: response.recipientPhone,
      reply_text: response.responseText,
      // BotSailor custom variables to populate cards
      vars: {
        locari_reply: response.responseText,
        action_taken: response.actionTaken || 'none'
      }
    };
  }
}
