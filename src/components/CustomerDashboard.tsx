import React from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  Plus,
  DollarSign,
  AlertCircle,
  Truck,
  Flame,
  Wind,
  Droplets,
  Calendar,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    sellRequests,
    setActiveModal,
    setSelectedOrder,
    setCurrentReceipt,
    settings,
  } = useApp();

  // Filter orders for current user
  const userOrders = orders.filter(
    (o) =>
      !currentUser ||
      o.customerEmail === currentUser.email ||
      o.customerPhone === currentUser.phone ||
      currentUser.role === 'admin'
  );

  const userSells = sellRequests.filter(
    (s) =>
      !currentUser ||
      s.customerEmail === currentUser.email ||
      s.customerPhone === currentUser.phone ||
      currentUser.role === 'admin'
  );

  const handleTrack = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setActiveModal('tracking');
  };

  const handleReceipt = (order: typeof orders[0]) => {
    setCurrentReceipt(order);
    setActiveModal('receipt');
  };

  const handlePay = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setActiveModal('payment');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow">
                {currentUser?.name.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
                  Customer Engineering Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Welcome, {currentUser?.name || 'Valued Customer'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Track active repairs, download payment receipts, or request equipment valuations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveModal('booking')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Book New Repair</span>
              </button>

              <button
                onClick={() => setActiveModal('sell')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Sell Faulty Equipment</span>
              </button>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block">Registered Email:</span>
              <span className="font-medium text-white truncate block">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Phone & SMS:</span>
              <span className="font-medium text-white block">{currentUser?.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Operating Hours:</span>
              <span className="font-medium text-amber-400 block">{settings.workingHours}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Refund Policy:</span>
              <span className="font-medium text-emerald-400 block">100% within 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Section: Active & Past Repair Orders */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <span>Your Repair & Servicing Jobs ({userOrders.length})</span>
            </h2>
            <span className="text-xs text-slate-500">Live real-time status updates</span>
          </div>

          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const isPaid = order.paymentStatus === 'paid_online';
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-amber-400 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                          {order.department === 'generators' ? (
                            <Flame className="w-5 h-5" />
                          ) : order.department === 'ac' ? (
                            <Wind className="w-5 h-5" />
                          ) : (
                            <Droplets className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-slate-900">
                              {order.orderNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                              {order.department} • {order.issueCategory}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 max-w-xl">
                            {order.issueDescription}
                          </p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-right mr-2">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Total Bill
                          </span>
                          <span className="text-base font-black text-slate-900">
                            {formatNaira(order.totalAmount)}
                          </span>
                          <span
                            className={`text-[10px] font-bold block ${
                              isPaid ? 'text-emerald-700' : 'text-amber-800'
                            }`}
                          >
                            {isPaid ? '✓ Paid Online' : '• Pay on Arrival'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleTrack(order)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Track Live Progress</span>
                        </button>

                        <button
                          onClick={() => handleReceipt(order)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>

                        {!isPaid && (
                          <button
                            onClick={() => handlePay(order)}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Current Status */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <span className="font-bold text-slate-900">
                          Current Stage: {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span>Mode: {order.deliveryMode.replace('_', ' ')}</span>
                      </div>

                      {order.inspectionNote && (
                        <div className="text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          Note: {order.inspectionNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No active repair orders yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Need a generator serviced, AC repaired, or borehole pump fixed? Book below.
              </p>
              <button
                onClick={() => setActiveModal('booking')}
                className="mt-4 px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Book First Repair
              </button>
            </div>
          )}
        </div>

        {/* Section: Your Equipment Sell Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <span>Machines You Offered for Sale ({userSells.length})</span>
            </h2>
            <button
              onClick={() => setActiveModal('sell')}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              + Sell Another Machine
            </button>
          </div>

          {userSells.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSells.map((sell) => (
                <div
                  key={sell.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {sell.requestNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          sell.status === 'offer_sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sell.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{sell.brandModel}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {sell.issueDescription}
                    </p>

                    <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between">
                      <span className="text-slate-500">Estimated Value:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {sell.offeredPrice ? formatNaira(sell.offeredPrice) : sell.estimatedOfferRange}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-3">
                    Submitted on {new Date(sell.createdAt).toLocaleDateString()} • Our inspector will contact you for cash collection.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
              <p className="text-xs">You have not submitted any machines for buyback yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
