import React, { useState } from 'react';
import {
  Settings,
  Wrench,
  ShoppingBag,
  DollarSign,
  Phone,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Volume2,
  Eye,
  FileText,
  CreditCard,
  Truck,
  Edit3,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';
import { OrderStatus, RepairOrder, EquipmentProduct, SellRequest } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    orders,
    updateOrderStatus,
    updateOrderInspection,
    updateOrderPayment,
    products,
    addProduct,
    deleteProduct,
    sellRequests,
    updateSellRequestOffer,
    setCurrentReceipt,
    setActiveModal,
    addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'sell_requests' | 'inventory' | 'settings'>('orders');

  // Business Settings Edit State
  const [phone, setPhone] = useState(settings.contactPhone);
  const [altPhone, setAltPhone] = useState(settings.alternatePhone);
  const [address, setAddress] = useState(settings.workshopAddress);
  const [hours, setHours] = useState(settings.workingHours);
  const [since, setSince] = useState<number | string>(settings.operatingSince);

  // Pricing Config Edit State
  const [servicingMin, setServicingMin] = useState(settings.pricingConfig.servicingMin);
  const [servicingMax, setServicingMax] = useState(settings.pricingConfig.servicingMax);
  const [overhaulingMin, setOverhaulingMin] = useState(settings.pricingConfig.overhaulingMin);
  const [overhaulingMax, setOverhaulingMax] = useState(settings.pricingConfig.overhaulingMax);
  const [homeServiceFee, setHomeServiceFee] = useState(settings.pricingConfig.homeServiceFee);
  const [pickupReturnFee, setPickupReturnFee] = useState(settings.pricingConfig.pickupReturnFee);

  // Selected Order for In-Depth Management
  const [inspectingOrder, setInspectingOrder] = useState<RepairOrder | null>(orders[0] || null);
  const [inspectionNoteText, setInspectionNoteText] = useState('');
  const [overhaulAdjustmentAmount, setOverhaulAdjustmentAmount] = useState<number>(0);
  const [overhaulAdjustmentReason, setOverhaulAdjustmentReason] = useState('');

  // New Product Modal/State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDept, setNewProdDept] = useState<'generators' | 'ac' | 'sumo'>('generators');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdModel, setNewProdModel] = useState('');
  const [newProdCapacity, setNewProdCapacity] = useState('');
  const [newProdCondition, setNewProdCondition] = useState<'brand_new' | 'fairly_used'>('brand_new');
  const [newProdPrice, setNewProdPrice] = useState(250000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(290000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdWarranty, setNewProdWarranty] = useState('6 Months Surevolt Warranty');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');

  // Broadcast Notification
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      contactPhone: phone,
      alternatePhone: altPhone,
      workshopAddress: address,
      workingHours: hours,
      operatingSince: Number(since) || 2015,
      pricingConfig: {
        servicingMin: Number(servicingMin),
        servicingMax: Number(servicingMax),
        overhaulingMin: Number(overhaulingMin),
        overhaulingMax: Number(overhaulingMax),
        homeServiceFee: Number(homeServiceFee),
        pickupReturnFee: Number(pickupReturnFee),
        workshopDropoffFee: 0,
      },
    });
    addNotification('Settings Updated', 'Business profile, working hours, and pricing rules saved successfully.', 'success');
  };

  const handleApplyInspection = (orderId: string) => {
    if (!inspectionNoteText.trim()) {
      alert('Please enter inspection findings.');
      return;
    }
    updateOrderInspection(
      orderId,
      inspectionNoteText,
      overhaulAdjustmentAmount > 0 ? overhaulAdjustmentAmount : undefined,
      overhaulAdjustmentAmount > 0 ? overhaulAdjustmentReason : undefined
    );
    setInspectionNoteText('');
    setOverhaulAdjustmentAmount(0);
    setOverhaulAdjustmentReason('');
    addNotification(
      'Inspection Saved & Client Notified',
      'Client received visual inspection report and overhaul pricing adjustment notice.',
      'info'
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand) return;
    addProduct({
      name: newProdName,
      department: newProdDept,
      brand: newProdBrand,
      modelNumber: newProdModel || 'MOD-' + Math.floor(Math.random() * 9000),
      capacity: newProdCapacity || 'Standard',
      condition: newProdCondition,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      description: newProdDesc || 'Fully tested in Surevolt workshop.',
      warranty: newProdWarranty,
      images: [newProdImage],
      specs: ['Pure Copper Core', 'Tested on Full Load', 'Clean Output Voltage'],
      testedChecklist: ['Load Bank Calibrated', 'Compression Test Passed', 'Zero Oil Leakage'],
      inStock: true,
    });
    setShowAddProduct(false);
    setNewProdName('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    addNotification(broadcastTitle, broadcastMsg, 'info');
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'request_received', label: '1. Request Received' },
    { value: 'picked_up', label: '2. Picked Up / Dispatched' },
    { value: 'diagnostic', label: '3. Diagnostic & Inspection' },
    { value: 'in_repair', label: '4. In Repair / Overhaul' },
    { value: 'quality_tested', label: '5. Quality Tested' },
    { value: 'ready_delivered', label: '6. Ready / Delivered' },
  ];

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Surevolt Control Center
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                  Live Operations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Admin Engineering Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage live work tickets, adjust prices in real time, inspect machines, and update business profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('sell_requests')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'sell_requests' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sell Requests ({sellRequests.length})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Inventory ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Business Settings
            </button>
          </div>
        </div>

        {/* TAB 1: REPAIR ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Order List (Left) */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Customer Job Tickets ({orders.length})
                </h3>

                <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                  {orders.map((order) => {
                    const isSelected = inspectingOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setInspectingOrder(order)}
                        className={`p-4 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {order.department} • {order.issueCategory}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                        <p className="text-xs text-slate-500">{order.customerPhone} • {order.deliveryMode.replace('_', ' ')}</p>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                          "{order.issueDescription}"
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-900">
                            {formatNaira(order.totalAmount)}
                          </span>
                          <span className="text-[11px] font-bold text-amber-600 uppercase">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Detail & Inspection Controls (Right) */}
              <div className="lg:col-span-7">
                {inspectingOrder ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {inspectingOrder.orderNumber}
                          </span>
                          <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                            {inspectingOrder.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Created {new Date(inspectingOrder.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCurrentReceipt(inspectingOrder);
                            setActiveModal('receipt');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Generate Receipt</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block">Customer Info</span>
                        <span className="font-bold text-slate-900 text-sm block">{inspectingOrder.customerName}</span>
                        <span className="text-slate-600 block">{inspectingOrder.customerPhone}</span>
                        <span className="text-slate-600 block">{inspectingOrder.customerEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block">Service Location & Mode</span>
                        <span className="font-bold text-slate-900 block">{inspectingOrder.deliveryMode.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-slate-600 block">{inspectingOrder.customerAddress}</span>
                      </div>
                    </div>

                    {/* Voice Note & Media Review */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Customer Diagnostics & Audio Note
                      </span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {inspectingOrder.issueDescription}
                      </p>

                      {inspectingOrder.voiceNoteUrl && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                            <Volume2 className="w-4 h-4 text-amber-600" />
                            <span>Customer Voice Note Recorded</span>
                          </div>
                          <audio controls src={inspectingOrder.voiceNoteUrl} className="h-8 max-w-[240px]" />
                        </div>
                      )}

                      {inspectingOrder.photos && inspectingOrder.photos.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pt-1">
                          {inspectingOrder.photos.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt="Fault picture"
                              className="w-20 h-20 rounded-xl object-cover border border-slate-300"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stage Pipeline Selector */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Update Workflow Status (Live to Customer)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {statusOptions.map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => updateOrderStatus(inspectingOrder.id, st.value, `Status updated to ${st.label}`)}
                            className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                              inspectingOrder.status === st.value
                                ? 'bg-slate-900 text-amber-400 ring-2 ring-amber-500'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visual Inspection & Overhaul Adjustment Panel */}
                    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                            Physical Visual Inspection & Overhaul Policy Adjustment
                          </h4>
                          <p className="text-[11px] text-amber-800">
                            Mandated Policy: If visual inspection confirms job booked as servicing requires overhaul, log findings below.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-amber-900 block mb-1">
                          Inspection Findings Note:
                        </label>
                        <textarea
                          rows={2}
                          value={inspectionNoteText}
                          onChange={(e) => setInspectionNoteText(e.target.value)}
                          placeholder="e.g. Dismantled cylinder block. Severe scoring on cylinder liner and cracked compression rings found. Requires complete overhaul."
                          className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-amber-900 block mb-1">
                            Overhaul Adjustment Fee (NGN)
                          </label>
                          <input
                            type="number"
                            value={overhaulAdjustmentAmount}
                            onChange={(e) => setOverhaulAdjustmentAmount(Number(e.target.value))}
                            placeholder="e.g. 5000"
                            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-amber-900 block mb-1">
                            Adjustment Reason / Parts Replaced
                          </label>
                          <input
                            type="text"
                            value={overhaulAdjustmentReason}
                            onChange={(e) => setOverhaulAdjustmentReason(e.target.value)}
                            placeholder="e.g. Upgraded to Complete Overhaul per Policy"
                            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyInspection(inspectingOrder.id)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Apply Inspection Findings & Notify Customer
                      </button>
                    </div>

                    {/* Payment Status Override */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Current Payment:</span>
                        <span className="text-sm font-bold text-slate-900 capitalize">
                          {inspectingOrder.paymentStatus.replace('_', ' ')} ({inspectingOrder.paymentMethod || 'None'})
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderPayment(inspectingOrder.id, 'pay_on_arrival')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Mark Paid (Cash/POS)
                        </button>
                        <button
                          onClick={() => updateOrderPayment(inspectingOrder.id, 'bank_transfer')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Mark Paid (Transfer)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                    <p>Select an order from the list on the left to review and manage.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELL REQUESTS (BUYBACK PROGRAM) */}
        {activeTab === 'sell_requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Equipment Offered by Customers for Cash Buyout ({sellRequests.length})
              </h3>
              <span className="text-xs text-slate-500">Inspect pictures, estimate value, and make cash offer</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-600">{req.requestNumber}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {req.department}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{req.brandModel}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seller: <strong>{req.customerName}</strong> ({req.customerPhone})
                    </p>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg">
                      "{req.issueDescription}"
                    </p>

                    {req.photos && req.photos.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {req.photos.map((src, i) => (
                          <img key={i} src={src} alt="Faulty unit" className="w-16 h-16 rounded-lg object-cover border border-slate-300" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Estimated Range:</span>
                      <span className="font-bold text-slate-900">{req.estimatedOfferRange}</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Offer Amount (NGN)"
                        id={`offer-${req.id}`}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`offer-${req.id}`) as HTMLInputElement;
                          const val = Number(input?.value);
                          if (val > 0) {
                            updateSellRequestOffer(req.id, val);
                            alert(`Offered ${formatNaira(val)} to ${req.customerName}!`);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg cursor-pointer shrink-0"
                      >
                        Send Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY / MARKETPLACE PRODUCTS */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Equipment Marketplace Catalog ({products.length})
                </h3>
                <p className="text-xs text-slate-500">Add, edit, or remove new and reworked fairly used units.</p>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Equipment for Sale</span>
              </button>
            </div>

            {/* Add Product Form Modal */}
            {showAddProduct && (
              <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-lg space-y-4 max-w-2xl">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-bold text-slate-900">List New / Tested Equipment</h4>
                  <button type="button" onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Equipment Name *</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Lutian 7.5kVA Key-Start Petrol Generator"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                    <select
                      value={newProdDept}
                      onChange={(e) => setNewProdDept(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    >
                      <option value="generators">Petrol Generator</option>
                      <option value="ac">Air Conditioner</option>
                      <option value="sumo">Submersible Pump (Sumo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="e.g. Lutian / Firman / Panasonic"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Condition</label>
                    <select
                      value={newProdCondition}
                      onChange={(e) => setNewProdCondition(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    >
                      <option value="brand_new">Brand New (Factory Box)</option>
                      <option value="fairly_used">Tested & Trusted Fairly Used (Grade A)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (NGN) *</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Original / Slash Price (NGN)</label>
                    <input
                      type="number"
                      value={newProdOriginalPrice}
                      onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-xs text-slate-600">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
                    Save to Catalog
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="h-44 bg-slate-100 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {p.condition.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{p.name}</h4>
                    <span className="text-base font-black text-slate-900 font-mono block">
                      {formatNaira(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BUSINESS PROFILE & PRICING RULES */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Live Pricing Rules Form */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span>Real-Time Pricing Configuration (Instant Website Update)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust standard price ranges. These values instantly reflect across all calculators, booking flows, and banners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Servicing Minimum (NGN)
                  </label>
                  <input
                    type="number"
                    value={servicingMin}
                    onChange={(e) => setServicingMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Default: ₦8,000</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Servicing Maximum (NGN)
                  </label>
                  <input
                    type="number"
                    value={servicingMax}
                    onChange={(e) => setServicingMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Default: ₦15,000</span>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <label className="text-xs font-bold text-amber-900 block mb-1">
                    Overhauling Minimum (NGN)
                  </label>
                  <input
                    type="number"
                    value={overhaulingMin}
                    onChange={(e) => setOverhaulingMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-mono font-bold"
                  />
                  <span className="text-[11px] text-amber-800 mt-1 block">Default: ₦12,000</span>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <label className="text-xs font-bold text-amber-900 block mb-1">
                    Overhauling Maximum (NGN)
                  </label>
                  <input
                    type="number"
                    value={overhaulingMax}
                    onChange={(e) => setOverhaulingMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-mono font-bold"
                  />
                  <span className="text-[11px] text-amber-800 mt-1 block">Default: ₦18,000</span>
                </div>
              </div>

              {/* Delivery Logistics Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Home Service Logistics Fee (NGN)
                  </label>
                  <input
                    type="number"
                    value={homeServiceFee}
                    onChange={(e) => setHomeServiceFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pickup & Return Transport Fee (NGN)
                  </label>
                  <input
                    type="number"
                    value={pickupReturnFee}
                    onChange={(e) => setPickupReturnFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              {/* Business Profile (Address & Contact Info) */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Business Profile & Operating Info (Fully Editable Anytime)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Primary Contact Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Alternate / WhatsApp Phone
                    </label>
                    <input
                      type="text"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Workshop Physical Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Working Hours (Daily)
                    </label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="6:00 AM – 9:00 PM Daily"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-amber-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Operating Continuously Since
                    </label>
                    <input
                      type="text"
                      value={since}
                      onChange={(e) => setSince(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow transition cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings & Prices</span>
                </button>
              </div>
            </form>

            {/* Notification Broadcast Tool */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-600" />
                <span>Instant In-App Broadcast / Service Announcement</span>
              </h4>
              <p className="text-xs text-slate-500">
                Send an immediate notification banner to all active website visitors and clients.
              </p>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="Announcement Title (e.g. Free Oil Check Promotion This Weekend)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={2}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Message content for website visitors..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Broadcast Announcement
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
