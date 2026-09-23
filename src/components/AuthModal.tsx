import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, login, loginWithGoogle, setCurrentUser } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'phone'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+234 ');

  if (activeModal !== 'auth') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'phone') {
      if (!phone.trim()) return;
      setCurrentUser({
        id: 'usr-' + Date.now(),
        name: 'Client ' + phone.slice(-4),
        email: `${phone.replace(/\D/g, '')}@surevolt.ng`,
        phone,
        role: 'customer',
      });
    } else if (authMode === 'signup') {
      if (!email.trim()) return;
      setCurrentUser({
        id: 'usr-' + Date.now(),
        name: name.trim() || email.split('@')[0],
        email,
        phone: phone || '+234 812 345 6789',
        role: 'customer',
      });
    } else {
      // Login
      const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'chrisaka141@gmail.com';
      login(email || 'customer@surevolt.ng', isAdmin ? 'admin' : 'customer');
    }
    setActiveModal(null);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setActiveModal(null);
  };

  const handleAdminQuickLogin = () => {
    login('chrisaka141@gmail.com', 'admin');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
              Surevolt Client Portal
            </span>
            <h3 className="text-xl font-black text-white">
              {authMode === 'login'
                ? 'Welcome Back'
                : authMode === 'signup'
                ? 'Create Your Account'
                : 'Login with Phone Number'}
            </h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-amber-600 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-amber-600 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New Sign Up
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              authMode === 'phone'
                ? 'bg-white text-amber-600 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Phone SMS
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick 1-Click Demo Profiles for Seamless Testing */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <span className="text-[11px] uppercase font-bold text-amber-900 block">
              ⚡ 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Customer (Chinedu)</span>
              </button>
              <button
                type="button"
                onClick={handleAdminQuickLogin}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Admin (Engr. Chris)</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">Or continue with</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Social Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google (Gmail)</span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chinedu Okafor"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {authMode !== 'phone' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nigerian Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              {authMode === 'login'
                ? 'Sign In to Portal'
                : authMode === 'signup'
                ? 'Create Surevolt Account'
                : 'Verify Phone & Login'}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400">
            Protected by Surevolt Privacy Policy & Zero Bad Record Guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};
