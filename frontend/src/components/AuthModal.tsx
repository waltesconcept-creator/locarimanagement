import React, { useState } from 'react';
import { X, Building2, Crown, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { LocariLogo } from './LocariLogo';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'property_manager' | 'landlord'>('property_manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!fullName || !phone) {
          setError('Please provide your full name and WhatsApp phone number.');
          setLoading(false);
          return;
        }

        const res = await api.registerUser({
          fullName,
          phone,
          email: email || `${phone.replace(/[^0-9]/g, '')}@locari.pm`,
          role,
          orgName: role === 'property_manager' ? `${fullName} Properties` : `${fullName} Portfolio`
        });

        if (res.error) throw new Error(res.error);
        onAuthSuccess(res.user);
        onClose();
      } else {
        // Sign in
        const identifier = phone || email || '08011223344';
        const res = await api.loginUser(identifier);
        if (res.error) throw new Error(res.error);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (asRole: 'property_manager' | 'landlord') => {
    setLoading(true);
    try {
      const identifier = asRole === 'property_manager' ? '08011223344' : '08023456789';
      const res = await api.loginUser(identifier);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError('Unable to log in demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-900 border border-surface-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center">
            <LocariLogo className="h-7 w-auto" badge="PM OS" />
          </div>
          <h3 className="text-xl font-black font-headline text-white">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-surface-400">
            {mode === 'signup' 
              ? 'Start managing properties with WhatsApp and Web Console.' 
              : 'Sign in to access your portfolio control centre.'}
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex p-1 bg-surface-950 rounded-xl mb-6 border border-surface-800">
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-brand-500 text-surface-950 font-black shadow-sm'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-brand-500 text-surface-950 font-black shadow-sm'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Balogun"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-white text-xs placeholder:text-surface-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('property_manager')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'property_manager'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-surface-800 bg-surface-950 text-surface-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Property Manager</div>
                    <div className="text-[10px] text-surface-500">I manage for others</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('landlord')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'landlord'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-surface-800 bg-surface-950 text-surface-400'
                    }`}
                  >
                    <Crown className="w-4 h-4 mb-1" />
                    <div className="text-xs font-bold">Landlord / Owner</div>
                    <div className="text-[10px] text-surface-500">I own properties</div>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-surface-300 mb-1.5">
              WhatsApp Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +234 801 234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-white text-xs placeholder:text-surface-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-300 mb-1.5">
              Email Address {mode === 'signup' && <span className="text-surface-500 font-normal">(Optional)</span>}
            </label>
            <input
              type="email"
              placeholder="e.g. contact@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-950 border border-surface-800 text-white text-xs placeholder:text-surface-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-surface-950 font-black text-xs tracking-wide shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Please wait...' : mode === 'signup' ? 'Create Account & Enter Console' : 'Sign In to Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-4 border-t border-surface-800 text-center space-y-2">
          <div className="text-[11px] text-surface-400 font-semibold">Or explore immediately as demo user:</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin('property_manager')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Demo Manager</span>
            </button>
            <button
              onClick={() => handleDemoLogin('landlord')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Landlord</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
