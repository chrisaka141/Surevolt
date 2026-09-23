import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { DepartmentCards } from './components/DepartmentCards';
import { TrustAndPolicy } from './components/TrustAndPolicy';
import { MarketplaceView } from './components/MarketplaceView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RepairBookingModal } from './components/RepairBookingModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SellEquipmentModal } from './components/SellEquipmentModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import {
  Wrench,
  Clock,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  Phone,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import { formatNaira } from './utils/categorization';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setActiveModal,
    notifications,
    removeNotification,
    settings,
    orders,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start justify-between gap-3 animate-in slide-in-from-top-3 duration-300 ${
              n.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-white'
                : n.type === 'error'
                ? 'bg-red-950/95 border-red-500/50 text-white'
                : 'bg-slate-950/95 border-amber-500/50 text-white'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {n.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : n.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {n.title}
                </h5>
                <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white shrink-0 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Header */}
      <Header />

      {/* Page Body View Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Banner Slider */}
            <HeroCarousel />

            {/* Core Department Cards */}
            <DepartmentCards />

            {/* Delivery Modes & Process Section */}
            <section className="py-16 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-600 tracking-widest uppercase px-3 py-1 bg-amber-50 rounded-full inline-block mb-2">
                    Engineered for Convenience
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    3 Flexible Service Delivery Modes
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Select how you want your generator, AC, or submersible pump serviced.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mode 1 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                      Most Popular
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      Pickup & Return Service
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Our logistics driver picks up your machine from your home or business, transports it to our specialized workshop for thorough overhaul & load testing, and delivers it back running like new.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Logistics Fee:</span>
                      <span className="text-sm font-mono font-bold text-slate-900">
                        +{formatNaira(settings.pricingConfig.pickupReturnFee)}
                      </span>
                    </div>
                  </div>

                  {/* Mode 2 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                      Direct On-Site
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      Home & Office Service
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Our certified electrical/mechanical engineers arrive at your address with mobile diagnostic tools, spare filters, and oil to carry out on-site servicing or AC re-gassing directly.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Technician Travel:</span>
                      <span className="text-sm font-mono font-bold text-slate-900">
                        +{formatNaira(settings.pricingConfig.homeServiceFee)}
                      </span>
                    </div>
                  </div>

                  {/* Mode 3 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Zero Logistics Fee
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      Workshop Drop-Off
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Drop off your equipment directly at our central workshop hub in Ikeja, Lagos. Our engineers start initial visual teardown immediately, and you pay strictly for the service or overhaul.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Drop-off Fee:</span>
                      <span className="text-sm font-mono font-bold text-emerald-600">FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust, Zero Bad Record & Policies Section */}
            <TrustAndPolicy />
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Engineering Capabilities
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
                Servicing, Overhauling & Precision Engineering
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2">
                Transparent pricing, clear distinction between routine servicing (₦{settings.pricingConfig.servicingMin.toLocaleString()} – ₦{settings.pricingConfig.servicingMax.toLocaleString()}) and overhauling (₦{settings.pricingConfig.overhaulingMin.toLocaleString()} – ₦{settings.pricingConfig.overhaulingMax.toLocaleString()}).
              </p>
            </div>
            <DepartmentCards />
            <TrustAndPolicy />
          </div>
        )}

        {activeTab === 'marketplace' && <MarketplaceView />}

        {activeTab === 'customer' && <CustomerDashboard />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Quick Action Floating Bar for Mobile/Desktop */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setActiveModal('booking')}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95"
        >
          <Wrench className="w-4 h-4 stroke-[2.5]" />
          <span>Book Repair</span>
        </button>

        <button
          onClick={() => setActiveModal('tracking')}
          className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95"
        >
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">Live Tracker</span>
        </button>
      </div>

      {/* Global Modals */}
      <RepairBookingModal />
      <PaymentModal />
      <ReceiptModal />
      <OrderTrackingModal />
      <SellEquipmentModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
