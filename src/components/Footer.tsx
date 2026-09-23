import React from 'react';
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Lock,
  Flame,
  Wind,
  Droplets,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, setActiveModal, setSelectedDepartmentFilter } = useApp();

  const handleDeptClick = (dept: 'generators' | 'ac' | 'sumo') => {
    setSelectedDepartmentFilter(dept);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Working Hours</span>
              <span className="text-xs text-amber-400">{settings.workingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">100% Refund Guarantee</span>
              <span className="text-xs text-slate-400">Cancel within 6–12h, refund in 24h</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Zero Bad Record</span>
              <span className="text-xs text-slate-400">Continuous operation since {settings.operatingSince}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Payment Channels</span>
              <span className="text-xs text-slate-400">Pay Online or on Arrival/Inspection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SURE<span className="text-amber-500">VOLT</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Surevolt is Nigeria’s premier certified engineering service for Petrol Generators, Air Conditioning systems, and Submersible Borehole Pumps (Sumo). Precision overhaul, certified load bank testing, and guaranteed buyback marketplace.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.workshopAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.contactPhone} / {settings.alternatePhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>service@surevolt.ng / sales@surevolt.ng</span>
              </p>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleDeptClick('generators')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Petrol Generators</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDeptClick('ac')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>Air Conditioners (AC)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDeptClick('sumo')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Submersible Pumps (Sumo)</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 block pt-1">
                  Servicing: ₦{settings.pricingConfig.servicingMin.toLocaleString()} – ₦{settings.pricingConfig.servicingMax.toLocaleString()}
                </span>
              </li>
              <li>
                <span className="text-slate-500 block">
                  Overhaul: ₦{settings.pricingConfig.overhaulingMin.toLocaleString()} – ₦{settings.pricingConfig.overhaulingMax.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>

          {/* Service Delivery Modes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Service Delivery
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Home Service (On-site Technician)</li>
              <li>• Pickup & Return Logistics</li>
              <li>• Workshop Drop-off (Ikeja Hub)</li>
              <li>• Real-Time Order Tracking</li>
              <li>• Digital Audio Diagnostic Notes</li>
              <li>• Instant Automated Receipt</li>
            </ul>
          </div>

          {/* Buy & Sell / Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Marketplace & Terms
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Buy Tested Equipment</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('sell')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sell Faulty Machine</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 1200, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Visual Inspection Agreement
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 1200, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  6–12h Refund Policy
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Surevolt Engineering Services Ltd. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Operating 6:00 AM to 9:00 PM Daily</span>
            <span>•</span>
            <span>Zero Bad Record Since {settings.operatingSince}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
