import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  Flame,
  Wind,
  Droplets,
  Truck,
  Home,
  Building2,
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CreditCard,
  Banknote,
  Check,
  CheckCircle2,
  Info,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioVoiceRecorder } from './AudioVoiceRecorder';
import { analyzeEquipmentIssue, formatNaira } from '../utils/categorization';
import { Department, DeliveryMode, IssueCategory, PaymentMethod } from '../types';

export const RepairBookingModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    settings,
    addOrder,
    currentUser,
    selectedDepartmentFilter,
    setSelectedOrder,
    addNotification,
  } = useApp();

  const pricing = settings.pricingConfig;

  // Form State
  const [department, setDepartment] = useState<Department>('generators');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [voiceNoteData, setVoiceNoteData] = useState<string | undefined>(undefined);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number | undefined>(undefined);
  const [photos, setPhotos] = useState<string[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('pickup_return');
  const [paymentOption, setPaymentOption] = useState<'pay_online' | 'pay_on_arrival'>('pay_online');
  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethod>('card');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+234 ');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');

  // Validation & Redirect State
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    description?: string;
    address?: string;
  }>({});
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const handleQuickFillDemo = () => {
    setCustomerName('Chinedu Okafor');
    setCustomerPhone('+234 814 092 3141');
    setCustomerEmail('chinedu.okafor@surevolt.ng');
    setCustomerAddress('12 Umudike Expressway / Oyigbo Junction');
    if (!issueDescription.trim()) {
      setIssueDescription('Generator won\'t start in the morning and makes rattling sound when pulled.');
    }
    setErrors({});
    addNotification('Sample Details Applied', 'Contact details filled for rapid testing.', 'info');
  };

  // Pre-select department if set
  useEffect(() => {
    if (selectedDepartmentFilter && selectedDepartmentFilter !== 'all') {
      setDepartment(selectedDepartmentFilter);
    }
  }, [selectedDepartmentFilter]);

  // Sync user details if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (!customerPhone || customerPhone === '+234 ') setCustomerPhone(currentUser.phone);
      if (!customerAddress && currentUser.address) setCustomerAddress(currentUser.address);
    }
  }, [currentUser]);

  // Automatic Categorization Analysis
  const analysis = analyzeEquipmentIssue(issueDescription, department, pricing);

  // Calculate fees
  const deliveryFee =
    deliveryMode === 'home_service'
      ? pricing.homeServiceFee
      : deliveryMode === 'pickup_return'
      ? pricing.pickupReturnFee
      : pricing.workshopDropoffFee;

  const basePrice =
    analysis.category === 'overhauling'
      ? Math.round((pricing.overhaulingMin + pricing.overhaulingMax) / 2)
      : Math.round((pricing.servicingMin + pricing.servicingMax) / 2);

  const totalEstimate = basePrice + deliveryFee;

  if (activeModal !== 'booking') return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert to base64 data URLs for instant preview
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      name?: string;
      phone?: string;
      description?: string;
      address?: string;
    } = {};

    if (!issueDescription.trim()) {
      newErrors.description = 'Please describe the fault or symptoms of your equipment.';
    }

    if (!customerName.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    const digitsOnly = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || digitsOnly.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (e.g. 0814 092 3141).';
    }

    if (deliveryMode !== 'workshop_dropoff' && !customerAddress.trim()) {
      newErrors.address = 'Please enter your address for pickup or technician visit.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addNotification(
        'Required Fields Missing',
        'Please complete the highlighted fields above to proceed to payment.',
        'warning'
      );
      // Automatically scroll to the first input with error
      const firstKey = Object.keys(newErrors)[0];
      const targetElement = document.getElementById(`booking-field-${firstKey}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.focus();
      }
      return;
    }

    setErrors({});
    setIsRedirectingToPayment(true);

    const finalAddress =
      customerAddress.trim() ||
      (deliveryMode === 'workshop_dropoff'
        ? 'Workshop Drop-off Hub: Central Umudike / Oyigbo Location'
        : 'Address to be confirmed via telephone');

    const order = addOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || 'customer@surevolt.ng',
      customerPhone: customerPhone.trim(),
      customerAddress: finalAddress,
      department,
      equipmentModel: equipmentModel.trim() || undefined,
      issueCategory: analysis.category,
      autoCategorizationReason: analysis.reason,
      issueDescription: issueDescription.trim(),
      voiceNoteUrl: voiceNoteData,
      voiceNoteDuration,
      photos: photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      ],
      deliveryMode,
      status: 'request_received',
      estimatedPrice: basePrice,
      deliveryFee,
      totalAmount: totalEstimate,
      paymentStatus: paymentOption === 'pay_online' ? 'unpaid' : 'pay_on_arrival',
      paymentMethod: paymentOption === 'pay_online' ? paymentMethodChoice : 'pay_on_arrival',
      inspectionNote: 'Pending physical workshop inspection.',
    });

    setSelectedOrder(order);

    if (paymentOption === 'pay_online') {
      addNotification(
        'Redirecting to Secure Payment',
        `Order ${order.orderNumber} created! Opening secure payment channels...`,
        'success'
      );
      // Seamlessly redirect to the Payment Modal
      setTimeout(() => {
        setIsRedirectingToPayment(false);
        setActiveModal('payment');
      }, 400);
    } else {
      setIsRedirectingToPayment(false);
      setActiveModal('tracking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Book Engineering Service / Repair</h3>
              <p className="text-xs text-slate-400">
                Operating hours 6:00 AM – 9:00 PM Daily • Instant diagnostic categorization
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form noValidate onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Step 1: Select Department */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. Select Equipment Department
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setDepartment('generators')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  department === 'generators'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Flame className={`w-5 h-5 ${department === 'generators' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs">Petrol Generator</span>
              </button>

              <button
                type="button"
                onClick={() => setDepartment('ac')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  department === 'ac'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Wind className={`w-5 h-5 ${department === 'ac' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs">Air Conditioner</span>
              </button>

              <button
                type="button"
                onClick={() => setDepartment('sumo')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  department === 'sumo'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Droplets className={`w-5 h-5 ${department === 'sumo' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs">Submersible (Sumo)</span>
              </button>
            </div>
          </div>

          {/* Model / Brand */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Machine Model or Capacity (Optional)
            </label>
            <input
              type="text"
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              placeholder="e.g. Sumec Firman 3.5kVA, Hisense 1.5HP, Pedrollo 2HP Sumo..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Step 2: Describe Issue & Audio Note */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Describe Equipment Problem (Text or Voice)
              </label>
              <span className="text-[11px] text-amber-700 font-semibold">
                Auto-categorization active
              </span>
            </div>

            <textarea
              id="booking-field-description"
              rows={3}
              value={issueDescription}
              onChange={(e) => {
                setIssueDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="E.g., Generator is smoking heavy white smoke and leaking oil, or AC is blowing warm air, or sumo is humming but not pumping..."
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition ${
                errors.description
                  ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                  : 'border-slate-300 focus:ring-amber-500'
              }`}
            />
            {errors.description && (
              <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.description}</span>
              </p>
            )}

            {/* Audio Voice Note Recorder */}
            <AudioVoiceRecorder
              existingAudioUrl={voiceNoteData}
              onAudioRecorded={(dataUrl, duration) => {
                setVoiceNoteData(dataUrl);
                setVoiceNoteDuration(duration);
              }}
              onAudioCleared={() => {
                setVoiceNoteData(undefined);
                setVoiceNoteDuration(undefined);
              }}
            />

            {/* Real-time Intelligent Categorization Feedback Banner */}
            {issueDescription.length > 5 && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  analysis.category === 'overhauling'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>
                    Auto-Categorized as:{' '}
                    <span className="uppercase tracking-wider font-black underline">
                      {analysis.category}
                    </span>{' '}
                    ({formatNaira(analysis.recommendedPriceRange.min)} – {formatNaira(analysis.recommendedPriceRange.max)})
                  </span>
                </div>
                <p className="text-slate-700">{analysis.reason}</p>

                {/* Crucial Visual Inspection Agreement Notice */}
                <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-start gap-1.5 text-[11px] text-slate-800">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Inspection Agreement Notice:</strong> If our engineering team on physical visual inspection discovers that a job booked as servicing is one requiring overhaul (e.g. smoking engine, knocked rings, or shortage of oil), you will be notified with photo evidence and prepared to pay the overhauling rate provided the overhauling is carried out.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Photos / Videos Upload */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              3. Upload Machine Photos / Video (Optional)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl bg-slate-50 hover:bg-amber-50/50 cursor-pointer flex items-center gap-2 text-xs font-semibold text-slate-700 transition">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Snap or Upload Picture</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photos.map((src, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 group">
                  <img src={src} alt="Uploaded broken machine" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Delivery Mode */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              4. Choose Delivery Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setDeliveryMode('pickup_return')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  deliveryMode === 'pickup_return'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-800">
                    +{formatNaira(pricing.pickupReturnFee)}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 block">Pickup & Return</span>
                <span className="text-[10px] text-slate-500">We pick up, repair at workshop & return</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('home_service')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  deliveryMode === 'home_service'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-700">
                    +{formatNaira(pricing.homeServiceFee)}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 block">Home Service</span>
                <span className="text-[10px] text-slate-500">Technician comes to your home/office</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('workshop_dropoff')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  deliveryMode === 'workshop_dropoff'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-emerald-600">FREE</span>
                </div>
                <span className="text-xs font-bold text-slate-900 block">Workshop Drop-off</span>
                <span className="text-[10px] text-slate-500">You bring machine to Umudike or Oyigbo workshop</span>
              </button>
            </div>
          </div>

          {/* Step 5: Contact Details */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                5. Customer Contact Details
              </label>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick-Fill Sample Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Your Full Name *
                </label>
                <input
                  id="booking-field-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Chinedu Okafor"
                  className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition ${
                    errors.name
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Phone Number (For SMS & Tracking) *
                </label>
                <input
                  id="booking-field-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="+234 814 092 3141"
                  className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition ${
                    errors.phone
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Pickup / Service Address (or Email)
                  </label>
                  {deliveryMode === 'workshop_dropoff' && (
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Optional for Workshop Drop-off
                    </span>
                  )}
                </div>
                <input
                  id="booking-field-address"
                  type="text"
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  placeholder={
                    deliveryMode === 'workshop_dropoff'
                      ? 'Drop-off at Umudike or Oyigbo workshop hub'
                      : 'Street address, Estate or Landmark (e.g. Umudike, Umuahia, Oyigbo, Port Harcourt)'
                  }
                  className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition ${
                    errors.address
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 6: Payment Preference */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              5. Select Payment Option
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 ${
                  paymentOption === 'pay_online'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentOption === 'pay_online'}
                  onChange={() => setPaymentOption('pay_online')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    Pay Online Now (Recommended)
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Instant automated receipt dispatched to your email & SMS. 100% refundable within 24h.
                  </span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 ${
                  paymentOption === 'pay_on_arrival'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentOption === 'pay_on_arrival'}
                  onChange={() => setPaymentOption('pay_on_arrival')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-slate-700" />
                    Pay on Arrival / Inspection
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Pay with Cash, Transfer or POS when driver picks up machine or after physical test.
                  </span>
                </div>
              </label>
            </div>

            {/* Estimated Total Breakdown Card */}
            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-700 block">
                  Estimated Labor ({analysis.category.toUpperCase()}) + Delivery
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Base: {formatNaira(basePrice)} | Logistics: {formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block uppercase">Total Estimate</span>
                <span className="text-xl font-black text-slate-900">
                  {formatNaira(totalEstimate)}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Alert Notice if Errors Exist */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-red-900">
                    Required Information Needed
                  </strong>
                  <span className="text-red-700 block mt-0.5">
                    Please provide your <strong>Name</strong>, <strong>Phone Number</strong>, and <strong>Issue Description</strong> above to proceed to payment.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                1-Tap Auto-Fill
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isRedirectingToPayment}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait"
            >
              {isRedirectingToPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to Payment Gateway...</span>
                </>
              ) : paymentOption === 'pay_online' ? (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Proceed to Secure Payment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Order & Track Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
