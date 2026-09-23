import React from 'react';
import {
  Wrench,
  Flame,
  Wind,
  Droplets,
  Truck,
  Home,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';
import { Department } from '../types';

export const DepartmentCards: React.FC = () => {
  const { settings, setActiveModal, setActiveTab, setSelectedDepartmentFilter } = useApp();
  const pricing = settings.pricingConfig;

  const handleBookDepartment = (dept: Department) => {
    setSelectedDepartmentFilter(dept);
    setActiveModal('booking');
  };

  const handleBuyDepartment = (dept: Department) => {
    setSelectedDepartmentFilter(dept);
    setActiveTab('marketplace');
  };

  const handleSellDepartment = (dept: Department) => {
    setSelectedDepartmentFilter(dept);
    setActiveModal('sell');
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase px-3 py-1 bg-amber-100 rounded-full inline-block mb-3">
            Core Engineering Divisions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Specialized Departments & Complete Power Solutions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            We don't just fix faults — we precision-engineer and calibrate equipment back to factory specifications.
            Explore our three dedicated engineering units below.
          </p>
        </div>

        {/* Live Pricing Transparency Callout Banner */}
        <div className="mb-12 bg-white rounded-2xl p-6 border-2 border-amber-400/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                  Current Official Price Ranges
                </span>
                <span className="text-xs text-slate-700 font-medium">Updated live by workshop admin</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Transparent Labor & Workshop Charges
              </h3>
              <p className="text-sm text-slate-700 max-w-2xl">
                No hidden costs. Every client receives an upfront estimate before work begins.
              </p>
            </div>

            {/* Price Badges Grid */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5">
                <span className="text-[11px] uppercase font-bold text-slate-700 block">
                  Routine Servicing
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatNaira(pricing.servicingMin)} – {formatNaira(pricing.servicingMax)}
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5">
                <span className="text-[11px] uppercase font-bold text-amber-800 block">
                  Complete Overhauling
                </span>
                <span className="text-lg font-black text-amber-900">
                  {formatNaira(pricing.overhaulingMin)} – {formatNaira(pricing.overhaulingMax)}
                </span>
              </div>
            </div>
          </div>

          {/* Crucial Visual Inspection Notice */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-slate-950">Visual Inspection Guarantee Notice:</strong> If during physical workshop inspection our engineering team discovers that a job initially booked as standard servicing requires an overhaul (e.g. smoking engine, scored piston liner, knocked crank, or severe oil leak), the client will be immediately informed with photographic proof and prepared to pay the overhauling rate provided the overhauling is executed.
            </p>
          </div>
        </div>

        {/* 3 Core Departments Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Petrol Generators */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Petrol Generator Workshop Repairs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                Department 01
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Power Generation
                </span>
                <h3 className="text-2xl font-black text-white">Petrol Generators</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Specialized repair and precision overhauling for all petrol generator brands (Sumec Firman, Lutian, Elepaq, Honda, Tiger, Thermocool).
                </p>

                {/* Service Bullet Points */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Precision Overhauling:</strong> Piston ring fitment, valve lapping, crankshaft balancing, and oil-leak arrest.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Routine Servicing:</strong> Spark plug tuning, ultrasonic carburetor purge, engine oil flushing.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Buy & Sell Marketplace:</strong> Sell faulty/used units for instant cash or buy tested & trusted generators.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleBookDepartment('generators')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Wrench className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                  <span>Book Generator Service</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSellDepartment('generators')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
                  >
                    Sell Faulty Gen
                  </button>
                  <button
                    onClick={() => handleBuyDepartment('generators')}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-lg transition text-center cursor-pointer border border-amber-200"
                  >
                    Buy Tested Gen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Air Conditioners */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                alt="Air Conditioner Repairs and Installation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                Department 02
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Cooling Systems
                </span>
                <h3 className="text-2xl font-black text-white">Air Conditioners (AC)</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comprehensive climate control engineering for split units, inverter models, standing units, and industrial ceiling cassettes.
                </p>

                {/* Service Bullet Points */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Repairs & Diagnostics:</strong> Compressor replacement, capacitor swap, PCB electronic repair, flare nut leak fixes.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Deep Servicing & Gas:</strong> High-pressure chemical foam coil wash, R410A / R22 / R32 gas recharging.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Professional Installation:</strong> Vibration-free wall mounting, piping insulation, electrical breaker setup.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleBookDepartment('ac')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Wind className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                  <span>Book AC Technician</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSellDepartment('ac')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
                  >
                    Sell Used AC
                  </button>
                  <button
                    onClick={() => handleBuyDepartment('ac')}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-lg transition text-center cursor-pointer border border-amber-200"
                  >
                    Buy Tested AC
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Submersible Pumps (Sumo) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
                alt="Submersible Pump Sumo Engineering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                Department 03
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Borehole & Water Systems
                </span>
                <h3 className="text-2xl font-black text-white">Submersible Pumps (Sumo)</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Heavy-duty borehole extraction, submersible motor rewinding, silicon carbide mechanical seal renewal, and control box rebuilding.
                </p>

                {/* Service Bullet Points */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Motor Rewinding:</strong> Pure Class H enameled copper winding with high insulation resistance (&gt;50MΩ).</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Impeller & Seal Service:</strong> Sand-resistant floating impeller assembly and dual mechanical water seals.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Control Panel Repairs:</strong> Capacitor replacement, thermal overload relay calibration, waterproof joint splices.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleBookDepartment('sumo')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Droplets className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                  <span>Book Sumo Repair</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSellDepartment('sumo')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
                  >
                    Sell Used Sumo
                  </button>
                  <button
                    onClick={() => handleBuyDepartment('sumo')}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-lg transition text-center cursor-pointer border border-amber-200"
                  >
                    Buy Tested Sumo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Service Delivery Modes Section */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Seamless Logistics
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Choose How You Want Your Service Delivered
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Select what fits your schedule best — we bring the tools or pick up your equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Home Service</h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {formatNaira(pricing.homeServiceFee)} Fee
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Our certified technician arrives at your residence or commercial premises with toolkits and genuine spare parts between 6:00 AM – 9:00 PM.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• On-site diagnostic & servicing</li>
                <li>• No transportation stress for you</li>
                <li>• Pay on arrival or online</li>
              </ul>
            </div>

            {/* Mode 2 */}
            <div className="bg-white rounded-xl p-6 border-2 border-amber-400 shadow-sm relative">
              <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Pickup & Return Service</h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {formatNaira(pricing.pickupReturnFee)} Fee
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Our logistics driver picks up your heavy generator, AC, or submersible pump, brings it to our fully equipped workshop, and returns it tested.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Safe transport with heavy lift gear</li>
                <li>• Comprehensive test-run on workshop load-bank</li>
                <li>• Return delivery to your doorstep</li>
              </ul>
            </div>

            {/* Mode 3 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Workshop Drop-off</h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FREE Delivery
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Bring your equipment directly to our central workshop in Ikeja. Meet the master mechanics and receive an immediate physical walk-through.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Free initial physical inspection</li>
                <li>• Direct consultation with lead engineers</li>
                <li>• Ready for collection upon quality test</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
