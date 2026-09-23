import React, { useRef } from 'react';
import {
  X,
  CheckCircle2,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';

export const ReceiptModal: React.FC = () => {
  const { activeModal, setActiveModal, currentReceipt, selectedOrder, settings } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  const order = currentReceipt || selectedOrder;

  if (activeModal !== 'receipt' || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Official Order & Payment Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Email & SMS Dispatch Notification */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Receipt dispatched via SMS to <strong>{order.customerPhone}</strong> & Email to{' '}
              <strong>{order.customerEmail}</strong>.
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
            DELIVERED
          </span>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 bg-white">
          {/* Header Branding */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  SURE<span className="text-amber-500">VOLT</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">{settings.tagline}</p>
              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {settings.workshopAddress}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {settings.contactPhone}
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" /> Working Hours: {settings.workingHours}
                </p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-black uppercase rounded tracking-wider">
                {order.paymentStatus === 'paid_online' ? 'PAID IN FULL' : 'PAY ON ARRIVAL'}
              </span>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Receipt No.</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {order.receiptNumber || 'RCP-' + order.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Order Date</span>
                <span className="text-xs font-semibold text-slate-700">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Mode Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Billed To Client:
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600">{order.customerPhone}</p>
              <p className="text-slate-600">{order.customerEmail}</p>
              <p className="text-slate-600 mt-1">{order.customerAddress}</p>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Service Order Details:
              </span>
              <p className="text-slate-700">
                <strong>Tracking Code:</strong>{' '}
                <span className="font-mono font-bold text-amber-700">{order.orderNumber}</span>
              </p>
              <p className="text-slate-700">
                <strong>Department:</strong> {order.department.toUpperCase()}
              </p>
              <p className="text-slate-700">
                <strong>Delivery Mode:</strong> {order.deliveryMode.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-slate-700">
                <strong>Payment Channel:</strong> {order.paymentMethod?.replace('_', ' ').toUpperCase()}
              </p>
              {order.transactionRef && (
                <p className="text-slate-500 text-[11px] font-mono">
                  Ref: {order.transactionRef}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Line Items */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2 font-bold">Service / Work Item</th>
                  <th className="py-2 font-bold text-center">Category</th>
                  <th className="py-2 font-bold text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">
                      {order.department === 'generators'
                        ? 'Petrol Generator Diagnostic & Restoration'
                        : order.department === 'ac'
                        ? 'Air Conditioner Technical Service'
                        : 'Submersible Pump (Sumo) Overhauling'}
                    </span>
                    <span className="text-[11px] text-slate-500 block max-w-sm">
                      {order.issueDescription.substring(0, 80)}...
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="uppercase text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {order.issueCategory}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatNaira(order.estimatedPrice)}
                  </td>
                </tr>

                {order.overhaulingAdjustment && (
                  <tr className="bg-amber-50/50">
                    <td className="py-2 text-amber-900">
                      <span className="font-bold block">Visual Inspection Upgrade (Overhaul)</span>
                      <span className="text-[10px] text-amber-700">
                        {order.overhaulingAdjustmentReason || 'Internal engine wear discovered on inspection.'}
                      </span>
                    </td>
                    <td className="py-2 text-center text-amber-800 font-semibold text-[11px]">
                      Adjustment
                    </td>
                    <td className="py-2 text-right font-bold text-amber-900">
                      +{formatNaira(order.overhaulingAdjustment)}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="py-3 text-slate-700 font-medium">
                    Logistics / Delivery Mode Fee ({order.deliveryMode.replace('_', ' ')})
                  </td>
                  <td className="py-3 text-center text-slate-500 text-[11px]">Logistics</td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {order.deliveryFee === 0 ? 'FREE' : formatNaira(order.deliveryFee)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Block */}
            <div className="border-t-2 border-slate-900 mt-3 pt-3 flex justify-between items-center text-sm">
              <div className="text-xs text-slate-500">
                <p>Tax & Environmental Levy: Included</p>
                <p>Surevolt 100% 24-hr Money Back Guarantee applies</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase block">Total Net Paid</span>
                <span className="text-2xl font-black text-slate-950">
                  {formatNaira(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Refund & Verification Seal */}
          <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Zero Bad Record Guarantee (Since {settings.operatingSince})
                </strong>
                <span>Cancellations within 6–12 hrs entitled to 100% refund within 24 hours.</span>
              </div>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
              <span className="font-serif italic font-bold text-slate-800 block text-sm">
                Surevolt Engineering QA
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Authorized Stamp</span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={() => setActiveModal('tracking')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
          >
            &larr; View Live Progress Tracker
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
