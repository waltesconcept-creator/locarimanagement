import React, { useState } from 'react';
import { 
  Settings, 
  MessageSquare, 
  Globe2, 
  ShieldCheck, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const webhookUrl = 'http://localhost:4000/webhook/botsailor';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
          Settings & Integrations
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          Configure your BotSailor subscription, webhook routing, WhatsApp numbers, and modular Locari Rental Discovery connector.
        </p>
      </div>

      {/* BotSailor Setup Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
                  BotSailor WhatsApp Webhook Gateway
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <p className="text-xs text-surface-500 mt-0.5">
                Connect your active BotSailor subscription to Locari's central backend engine.
              </p>
            </div>
          </div>
        </div>

        {/* Webhook URL Copy Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-surface-700 dark:text-surface-300">
            BotSailor Inbound Webhook / HTTP API URL:
          </label>
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
            <code className="flex-1 font-mono text-xs text-brand-600 dark:text-brand-400 px-3 select-all">
              {webhookUrl}
            </code>
            <button
              onClick={handleCopyWebhook}
              className="px-3 py-1.5 rounded-xl bg-surface-200 dark:bg-surface-800 hover:bg-brand-500 hover:text-surface-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Setup Checklist */}
        <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 space-y-2 text-xs">
          <div className="font-bold text-surface-900 dark:text-surface-100">
            BotSailor Flow Configuration Steps:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-surface-600 dark:text-surface-400">
            <li>In your BotSailor dashboard, navigate to <strong>Bot Manager</strong>.</li>
            <li>Create an <strong>Action / Webhook Card</strong> in your Main Flow.</li>
            <li>Set the HTTP Method to <strong>POST</strong> and paste the URL above.</li>
            <li>Set Request Body Type to <strong>Raw / JSON</strong> (with subscriber phone & message text).</li>
            <li>Our backend processes the intent and returns formatted conversational answers!</li>
          </ol>
        </div>
      </div>

      {/* Locari Rental Discovery Connector Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
              Locari Rental Discovery Connector
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Publish vacant units directly from your portfolio to <a href="https://locari.africa" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">www.locari.africa</a>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 space-y-2 text-xs text-surface-600 dark:text-surface-400">
          <div className="flex items-center justify-between font-semibold">
            <span>Modular Bridge Status:</span>
            <span className="text-emerald-600 font-bold">Active & Configured</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            When you mark an apartment unit as vacant in <strong>Properties & Units</strong>, you can click <em>"Publish to Locari.africa"</em>. Prospective tenants can then view the listing, request live video tours, and contact you directly.
          </p>
        </div>
      </div>

      {/* Subscription & Multi-Tenancy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
              Organization Subscription Plan
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Locari Property Management Services (Operating as Locari's internal management agency).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
            <div className="text-[10px] text-surface-400 uppercase font-bold">Plan Type</div>
            <div className="text-sm font-black text-brand-500 mt-0.5">Locari Enterprise / Internal</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
            <div className="text-[10px] text-surface-400 uppercase font-bold">Max Units Limit</div>
            <div className="text-sm font-black text-surface-900 dark:text-surface-100 mt-0.5">500 Units</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
            <div className="text-[10px] text-surface-400 uppercase font-bold">Billing Status</div>
            <div className="text-sm font-black text-emerald-600 mt-0.5">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};
