import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminGate: React.FC = () => {
  const { adminLogin, setActiveTab } = useApp();

  const [email, setEmail] = useState('chrisaka141@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (!res.success) {
        setErrorMessage(
          res.error ||
            'Access Denied: You are not the web app owner and have not been granted admin permission.'
        );
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected authentication error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Top Restricted Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Restricted Area • Owner Authentication Required</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/5">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Surevolt Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            This control portal is private and accessible <span className="text-amber-400 font-semibold">strictly to the web app owner</span> (<code className="text-amber-300 font-mono">chrisaka141@gmail.com</code>) and personnel granted permission by the owner.
          </p>
        </div>

        {/* Gate Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Sign In with Owner Credentials
            </h2>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Access Denied</p>
                <p className="mt-0.5 text-red-200/90">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Owner Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="chrisaka141@gmail.com"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition font-medium placeholder-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Owner Password
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Required</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter owner password"
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-white text-sm outline-none transition font-medium placeholder-slate-600 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Unlock Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Website</span>
            </button>
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Zero-Trust Access Control Enforced</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            This web application denies access to any user who is not the web app owner (<code className="text-amber-400 font-mono">chrisaka141@gmail.com</code>) or explicitly granted permission in the administrative registry.
          </p>
        </div>
      </div>
    </div>
  );
};
