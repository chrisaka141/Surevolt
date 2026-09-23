import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  CreditCard,
  RotateCcw,
  Volume2,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';
import { OrderStatus, RepairOrder } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    orders,
    selectedOrder,
    setSelectedOrder,
    setActiveTab,
    setCurrentReceipt,
    addNotification,
  } = useApp();

  const [searchCode, setSearchCode] = useState(selectedOrder?.orderNumber || '');
  const [searchedOrder, setSearchedOrder] = useState<RepairOrder | null>(selectedOrder || orders[0] || null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  if (activeModal !== 'tracking') return null;

  const current = searchedOrder || selectedOrder || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerPhone.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query)
    );
    if (found) {
      setSearchedOrder(found);
      setSelectedOrder(found);
    } else {
      alert(`No order found matching "${searchCode}". Try using sample ID "SV-2026-9041".`);
    }
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'request_received',
      label: 'Request Received',
      desc: 'Order ticket registered in workshop queue.',
    },
    {
      key: 'picked_up',
      label: 'Dispatched / Picked Up',
      desc: 'Technician dispatched or driver collecting machine.',
    },
    {
      key: 'diagnostic',
      label: 'Diagnostic & Inspection',
      desc: 'Physical teardown, electrical test & visual inspection.',
    },
    {
      key: 'in_repair',
      label: 'In Repair / Overhauling',
      desc: 'Precision re-machining, part fitting & assembly.',
    },
    {
      key: 'quality_tested',
      label: 'Quality Tested',
      desc: 'Load-bank benchmark & full performance test run.',
    },
    {
      key: 'ready_delivered',
      label: 'Ready / Delivered',
      desc: 'Ready for customer pickup or safely delivered.',
    },
  ];

  const currentStepIndex = current
    ? steps.findIndex((s) => s.key === current.status)
    : 0;

  const handleRequestCancel = () => {
    setCancelModalOpen(false);
    addNotification(
      'Cancellation Requested',
      `Order ${current.orderNumber} cancelled within window. 100% refund of ${formatNaira(current.totalAmount)} scheduled for release within 24 hours.`,
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
              Real-Time Workshop Dispatch
            </span>
            <h3 className="text-lg font-black text-white">Live Repair & Service Tracking</h3>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-100 p-4 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order Code (e.g. SV-2026-9041) or Phone..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              Track Order
            </button>
          </form>

          {/* Quick order selector if user has multiple */}
          {orders.length > 1 && (
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
              <span className="font-semibold shrink-0">Recent Orders:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchedOrder(o);
                    setSelectedOrder(o);
                    setSearchCode(o.orderNumber);
                  }}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition shrink-0 cursor-pointer ${
                    current?.id === o.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-white border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {o.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Tracker Body */}
        {current ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
            {/* Status Summary Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                    {current.orderNumber}
                  </span>
                  <span className="text-xs text-slate-300 uppercase font-semibold">
                    {current.department} • {current.issueCategory}
                  </span>
                </div>
                <h4 className="text-xl font-black text-white">
                  {steps[currentStepIndex >= 0 ? currentStepIndex : 0]?.label}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  {steps[currentStepIndex >= 0 ? currentStepIndex : 0]?.desc}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                  {current.paymentStatus === 'paid_online' ? 'PAID ONLINE' : 'PAY ON ARRIVAL'}
                </span>
                <button
                  onClick={() => {
                    setCurrentReceipt(current);
                    setActiveModal('receipt');
                  }}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Official Receipt</span>
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-4">
                Service Progress Pipeline
              </span>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Step Node */}
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 animate-pulse'
                            : isCompleted
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-700'
                                : isCompleted
                                ? 'text-slate-900'
                                : 'text-slate-700'
                            }`}
                          >
                            {step.label}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Inspection Notice & Engineering Notes */}
            {current.inspectionNote && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Physical Inspection Log & Findings</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{current.inspectionNote}</p>
                {current.overhaulingAdjustment && (
                  <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200 font-semibold">
                    Adjustment applied: +{formatNaira(current.overhaulingAdjustment)} for complete overhaul as per Surevolt policy.
                  </div>
                )}
              </div>
            )}

            {/* Customer Audio / Photos Uploaded */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Submitted Diagnostics & Attachments
              </span>

              <p className="text-xs text-slate-700 italic">"{current.issueDescription}"</p>

              {current.voiceNoteUrl && (
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Voice note recorded by client ({current.voiceNoteDuration || 8}s)</span>
                  <audio controls src={current.voiceNoteUrl} className="h-8 max-w-[200px] ml-auto" />
                </div>
              )}

              {current.photos && current.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-1">
                  {current.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Fault photo"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Policy Reminder & Cancellation Action */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5 text-slate-500">
                <p className="flex items-center gap-1 font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Surevolt 100% Money-Back Policy
                </p>
                <p>Eligible for cancellation within 6–12 hrs of ordering with 24-hr refund.</p>
              </div>

              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Order & Request Refund</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <p>No orders found. Enter your tracking code above to check progress.</p>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {cancelModalOpen && (
          <div className="p-4 bg-red-50 border-t border-red-200 flex items-center justify-between">
            <div className="text-xs text-red-900">
              <strong>Confirm cancellation of {current?.orderNumber}?</strong>
              <p className="text-[11px] text-red-700">
                Refund of {formatNaira(current?.totalAmount || 0)} will be released within 24 hours.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Keep Order
              </button>
              <button
                onClick={handleRequestCancel}
                className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
