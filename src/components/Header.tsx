import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  Phone,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  Zap,
  Cloud,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    settings,
    currentUser,
    activeTab,
    setActiveTab,
    setActiveModal,
    logout,
    adminLogout,
    toggleAdminMode,
    setSelectedDepartmentFilter,
    isFirebaseConnected,
    isAdmin,
    isOwner,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string, depFilter?: 'all' | 'generators' | 'ac' | 'sumo') => {
    setActiveTab(tab);
    if (depFilter) {
      setSelectedDepartmentFilter(depFilter);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner with Working Hours & Emergency Contacts */}
      <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold tracking-tight">
              <Clock className="w-3.5 h-3.5 text-slate-950" />
              Working Hours: {settings.workingHours}
            </span>
            <span className="hidden md:inline-block text-slate-800">|</span>
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
              Since {settings.operatingSince} • Zero Bad Record Commitment
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/60 text-slate-950 text-[11px] font-medium" title="Firestore Real-time Cloud Active">
              <Cloud className="w-3 h-3 text-slate-950" />
              <span>{isFirebaseConnected ? 'Firebase Cloud' : 'Cloud Syncing'}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-1.5 hover:underline font-bold text-slate-950"
                title="Call Surevolt Engineering"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {settings.contactPhone}</span>
              </a>

              <a
                href={`https://wa.me/${settings.contactPhone.replace(/[^0-9]/g, '')}?text=Hello%20Surevolt%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 hover:bg-emerald-900 font-bold text-[11px] transition shadow-xs cursor-pointer"
                title="Chat with Surevolt on WhatsApp (+234 8140923141)"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>Also on WhatsApp</span>
              </a>
            </div>

            {isAdmin && (
              <button
                onClick={toggleAdminMode}
                className="px-2 py-0.5 bg-slate-950 text-amber-400 rounded text-[11px] font-mono font-bold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
                title="Toggle between Customer and Admin mode"
              >
                <Zap className="w-3 h-3" />
                {activeTab === 'admin' ? 'Customer View' : 'Admin Portal'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 text-slate-950 transform group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                SURE<span className="text-amber-400">VOLT</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-amber-400/20 text-amber-400 rounded">
                ENG
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-wider -mt-1 hidden sm:block">
              Generators • AC • Submersible Pumps
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNav('home')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('generators', 'generators')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'generators'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Petrol Generators
          </button>

          <button
            onClick={() => handleNav('ac', 'ac')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ac'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Air Conditioners
          </button>

          <button
            onClick={() => handleNav('sumo', 'sumo')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sumo'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Submersible Pumps (Sumo)
          </button>

          <button
            onClick={() => handleNav('marketplace')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Buy & Sell
          </button>

          <button
            onClick={() => handleNav('track')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'track'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Track Order
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-amber-400 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('customer_portal')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Login / Sign Up</span>
            </button>
          )}

          <button
            onClick={() => setActiveModal('booking')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-lg shadow-md hover:shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Repair</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setActiveModal('booking')}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('generators', 'generators')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Petrol Generators
          </button>
          <button
            onClick={() => handleNav('ac', 'ac')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Air Conditioners (AC)
          </button>
          <button
            onClick={() => handleNav('sumo', 'sumo')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Submersible Pumps (Sumo)
          </button>
          <button
            onClick={() => handleNav('marketplace')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Buy & Sell Equipment</span>
            <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded">Store</span>
          </button>
          <button
            onClick={() => handleNav('track')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-200 font-medium hover:bg-slate-800"
          >
            Track Repair Status
          </button>

          {/* Quick Call & WhatsApp Mobile Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <a
              href={`tel:${settings.contactPhone}`}
              className="py-2.5 px-3 rounded-lg bg-slate-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-slate-700 hover:bg-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Hotline</span>
            </a>
            <a
              href={`https://wa.me/${settings.contactPhone.replace(/[^0-9]/g, '')}?text=Hello%20Surevolt%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {currentUser ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleNav('customer_portal')}
                className="text-left text-sm font-semibold text-amber-400"
              >
                My Account ({currentUser.name})
              </button>
              <button
                onClick={logout}
                className="text-xs text-red-400 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveModal('auth');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-center text-sm font-semibold text-white mt-2"
            >
              Login / Sign Up
            </button>
          )}

          {isAdmin ? (
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  handleNav('admin');
                }}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isOwner ? '👑 Owner Portal' : 'Admin Portal'}</span>
              </button>
              <button
                onClick={() => {
                  adminLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-lg bg-slate-800 text-red-400 border border-red-500/30 text-xs font-bold text-center cursor-pointer"
                title="Lock Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => {
                  handleNav('admin');
                }}
                className="w-full py-2.5 rounded-lg bg-slate-950 text-amber-400 text-xs font-mono font-bold text-center border border-amber-500/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal (Restricted 🔒)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
