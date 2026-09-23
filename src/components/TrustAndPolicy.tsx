import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  Star,
  Quote,
  AlertCircle,
  FileText,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrustAndPolicy: React.FC = () => {
  const { settings, setActiveModal } = useApp();
  const [activePolicyTab, setActivePolicyTab] = useState<'refund' | 'inspection' | 'warranty' | 'privacy'>('refund');

  const testimonials = [
    {
      name: 'Dr. Babatunde Alabi',
      role: 'Clinic Director, Ikeja',
      text: 'Our 7.5kVA Lutian clinic generator knocked at 7:00 AM on a Monday. Surevolt team picked it up, performed a complete overhaul by evening, and delivered it back. It has been running flawlessly without smoke for 6 months now.',
      rating: 5,
      service: 'Generator Overhauling',
    },
    {
      name: 'Engr. Sarah Nwachukwu',
      role: 'Estate Manager, Lekki',
      text: 'Their submersible pump (Sumo) rewinding service saved our residential estate over ₦400,000 compared to buying a brand new Italian pump. The pressure test and Class-H winding quality are top notch.',
      rating: 5,
      service: 'Submersible Pump (Sumo) Overhaul',
    },
    {
      name: 'Alhaji Musa Danladi',
      role: 'Supermarket Owner, Maryland',
      text: 'I bought two fairly used 2.0HP Inverter ACs from Surevolt. They look and chill like factory new units. Plus their 6am to 9pm service availability gives immense peace of mind.',
      rating: 5,
      service: 'Used AC Purchase & Installation',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Zero Bad Record Headline */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-16">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Operating Continuously Since {settings.operatingSince}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Zero Bad Record Commitment. Over a Decade of Proven Craftsmanship.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                At Surevolt, engineering is not guesswork. Every petrol generator, air conditioner, and submersible borehole pump that enters our workshop is subjected to certified load-bank calibration, pressure tests, and digital diagnostic protocols.
              </p>

              {/* 4 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Verified Pure Copper Coils</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Genuine Factory Piston & Bearing Kits</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Prompt Daily Response (6:00 AM – 9:00 PM)</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Full Written Invoice & Receipt Issued</span>
                </div>
              </div>
            </div>

            {/* Proof Card on Right */}
            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-3xl font-black text-amber-400">10+</span>
                  <span className="text-xs text-slate-300 block font-medium">Years in Business</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-white">4,800+</span>
                  <span className="text-xs text-slate-300 block font-medium">Machines Restored</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-emerald-400">0</span>
                  <span className="text-xs text-slate-300 block font-medium">Unresolved Disputes</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Surevolt Golden Guarantee
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "If our team repairs or overhauls your equipment and it fails to satisfy the agreed benchmark during the warranty period, we will re-service it free of charge or honor our refund policy immediately."
                </p>
              </div>

              <button
                onClick={() => setActiveModal('booking')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                Experience Surevolt Service Today
              </button>
            </div>
          </div>
        </div>

        {/* Official Policies & Refund Section */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase px-3 py-1 bg-amber-50 rounded-full inline-block mb-2">
              Customer Protection
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Clear & Transparent Business Policies
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Your money and equipment are safe with us. Review our clear cancellation, refund, and inspection terms.
            </p>
          </div>

          {/* Policy Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setActivePolicyTab('refund')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activePolicyTab === 'refund'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              100% Refund & Cancellation
            </button>
            <button
              onClick={() => setActivePolicyTab('inspection')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activePolicyTab === 'inspection'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Visual Inspection & Overhaul Policy
            </button>
            <button
              onClick={() => setActivePolicyTab('warranty')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activePolicyTab === 'warranty'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Warranty & Test-Run Assurance
            </button>
            <button
              onClick={() => setActivePolicyTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activePolicyTab === 'privacy'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Privacy Policy & Security
            </button>
          </div>

          {/* Policy Tab Content Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
            {activePolicyTab === 'refund' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <RotateCcw className="w-6 h-6" />
                  <h4 className="text-xl font-bold text-slate-900">
                    6–12 Hour Order Cancellation & 24-Hour 100% Refund Policy
                  </h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  We believe in zero risk for our valued customers. If you book any service, pickup, or equipment order and subsequently decide to cancel:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Cancellation Window
                    </span>
                    <span className="text-lg font-black text-slate-900 block mt-1">
                      Within 6 to 12 Hours
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      You are fully entitled to submit a cancellation request through the customer portal or by calling our service line within 6 to 12 hours of placing the order before technician dispatch.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Refund Processing Time
                    </span>
                    <span className="text-lg font-black text-emerald-600 block mt-1">
                      Within 24 Hours
                    </span>
                    <p className="text-xs text-slate-600 mt-1">
                      After receiving the cancellation notification, 100% of your paid funds will be refunded directly to your bank account or original card within 24 hours guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicyTab === 'inspection' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                  <h4 className="text-xl font-bold text-slate-900">
                    Physical Visual Inspection & Overhaul Billing Policy
                  </h4>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 leading-relaxed">
                  <strong>Important Customer Agreement:</strong> When you book a service as standard routine servicing (priced at {settings.pricingConfig.servicingMin.toLocaleString()} – {settings.pricingConfig.servicingMax.toLocaleString()} Naira), our engineering protocol mandates an initial physical tear-down and visual inspection.
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  If on visual inspection our engineering team discovers that the machine exhibits internal engine damage (such as a scored cylinder liner, knocked crankshaft, broken piston rings causing heavy smoke, or severe oil shortage), standard servicing cannot solve the defect:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>The customer will receive an immediate visual photo/video report showing the exact defective parts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>The client should be aware and prepared that he/she will pay the charge for overhauling ({settings.pricingConfig.overhaulingMin.toLocaleString()} – {settings.pricingConfig.overhaulingMax.toLocaleString()} Naira) provided the overhauling is agreed upon and executed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Payment can be made directly in-app or upon arrival/delivery of the completed order.</span>
                  </li>
                </ul>
              </div>
            )}

            {activePolicyTab === 'warranty' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Award className="w-6 h-6" />
                  <h4 className="text-xl font-bold text-slate-900">
                    Warranty on Repaired & Reworked Equipment
                  </h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Every overhauled petrol generator, refurbished air conditioner, and rewound submersible pump is rigorously load-tested in our workshop prior to dispatch.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block text-sm">Overhauled Generators</span>
                    <span className="text-xs text-amber-700 font-bold block mt-0.5">3 Months Warranty</span>
                    <span className="text-[11px] text-slate-700 mt-1 block">Covers piston, rings, valves & oil seal.</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block text-sm">Air Conditioners</span>
                    <span className="text-xs text-amber-700 font-bold block mt-0.5">6 Months Warranty</span>
                    <span className="text-[11px] text-slate-700 mt-1 block">Covers compressor, cooling circuit & gas pressure.</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block text-sm">Submersible Pumps (Sumo)</span>
                    <span className="text-xs text-amber-700 font-bold block mt-0.5">6 Months Warranty</span>
                    <span className="text-[11px] text-slate-700 mt-1 block">Covers rewound motor coils & mechanical seals.</span>
                  </div>
                </div>
              </div>
            )}

            {activePolicyTab === 'privacy' && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3 text-slate-900">
                  <FileText className="w-6 h-6 text-amber-500" />
                  <h4 className="text-xl font-bold text-slate-900">
                    Surevolt Privacy & Customer Data Protection
                  </h4>
                </div>
                <p className="leading-relaxed">
                  We respect your personal privacy. Customer phone numbers, addresses, and equipment notes are strictly utilized for service dispatch, live order notifications via SMS/Email, and digital receipt generation.
                </p>
                <p className="text-xs text-slate-700">
                  We do not sell, distribute, or share customer data with unauthorized third parties. All online payments are handled via certified secure tokenized channels.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Verified Testimonials
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              What Our Engineering Clients Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                      {t.service}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{t.name}</h5>
                    <span className="text-[11px] text-slate-500 block">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
