import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';
import { PaymentMethod } from '../types';

export const PaymentModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedOrder,
    selectedProduct,
    updateOrderPayment,
    addNotification,
  } = useApp();

  const [paymentTab, setPaymentTab] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('5399 4100 2931 8840');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('412');
  const [cardPin, setCardPin] = useState('****');

  if (activeModal !== 'payment') return null;

  const itemTitle = selectedOrder
    ? `Repair Order ${selectedOrder.orderNumber} (${selectedOrder.department.toUpperCase()})`
    : selectedProduct
    ? `Purchase: ${selectedProduct.name}`
    : 'Surevolt Engineering Service';

  const amountToPay = selectedOrder
    ? selectedOrder.totalAmount
    : selectedProduct
    ? selectedProduct.price
    : 15000;

  const handlePaySuccess = (method: PaymentMethod) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedOrder) {
        updateOrderPayment(selectedOrder.id, method);
        setActiveModal('receipt');
      } else {
        addNotification(
          'Payment Successful!',
          `Payment of ${formatNaira(amountToPay)} confirmed. Receipt dispatched to your email & SMS.`,
          'success'
        );
        setActiveModal(null);
      }
    }, 1200);
  };

  const copyAccountNumber = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
              Surevolt Secure Pay
            </span>
            <h3 className="text-lg font-black text-white">Complete Secure Payment</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Banner */}
        <div className="bg-amber-50 p-4 border-b border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 font-medium block">{itemTitle}</span>
            <span className="text-xs text-slate-500">Includes guaranteed 24-hr refund policy</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Due</span>
            <span className="text-xl font-black text-slate-900">
              {formatNaira(amountToPay)}
            </span>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPaymentTab('card')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentTab === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-500" />
              <span>Debit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentTab('transfer')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentTab === 'transfer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-amber-500" />
              <span>Bank Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentTab('ussd')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentTab === 'ussd'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-500" />
              <span>USSD Code</span>
            </button>
          </div>

          {/* Tab 1: Debit Card */}
          {paymentTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    CVV Security Code
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handlePaySuccess('card')}
                className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">Processing secure payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize {formatNaira(amountToPay)}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 2: Bank Transfer */}
          {paymentTab === 'transfer' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Bank Name:</span>
                  <span className="font-bold text-slate-900">Providus Bank / Sterling</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Account Name:</span>
                  <span className="font-bold text-slate-900">Surevolt Engineering Ltd</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-amber-600">
                      5401928371
                    </span>
                    <button
                      type="button"
                      onClick={() => copyAccountNumber('5401928371')}
                      className="p-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transfers auto-verify within 30 seconds via our automated webhook.</span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handlePaySuccess('bank_transfer')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition cursor-pointer"
              >
                {isProcessing ? 'Verifying bank credit...' : 'I Have Transferred the Funds'}
              </button>
            </div>
          )}

          {/* Tab 3: USSD */}
          {paymentTab === 'ussd' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs text-slate-500 block">Dial USSD string on your phone:</span>
                <span className="text-xl font-mono font-black text-slate-900 bg-amber-100/70 px-3 py-1.5 rounded-lg inline-block">
                  *737*2*15000*5401928371#
                </span>
                <span className="text-[11px] text-slate-500 block">GTBank, Zenith, Access, or UBA</span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handlePaySuccess('ussd')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer"
              >
                {isProcessing ? 'Waiting for USSD session...' : 'Confirm USSD Dialed'}
              </button>
            </div>
          )}

          {/* Security Guarantee Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600 pt-2">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>256-Bit SSL Encryption • Instant Receipt to Email & SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
