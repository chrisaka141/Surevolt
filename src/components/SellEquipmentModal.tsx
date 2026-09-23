import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Camera,
  Flame,
  Wind,
  Droplets,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Department } from '../types';

export const SellEquipmentModal: React.FC = () => {
  const { activeModal, setActiveModal, addSellRequest, currentUser, selectedDepartmentFilter } = useApp();

  const [department, setDepartment] = useState<Department>(
    selectedDepartmentFilter && selectedDepartmentFilter !== 'all'
      ? selectedDepartmentFilter
      : 'generators'
  );
  const [brandModel, setBrandModel] = useState('');
  const [workingCondition, setWorkingCondition] = useState<'not_working' | 'working_with_faults' | 'working_good'>('working_with_faults');
  const [issueDescription, setIssueDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+234 ');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');

  if (activeModal !== 'sell') return null;

  // Calculate dynamic buyback estimate range based on department & condition
  const getEstimatedOfferRange = () => {
    if (department === 'generators') {
      if (workingCondition === 'working_good') return '₦90,000 – ₦180,000';
      if (workingCondition === 'working_with_faults') return '₦60,000 – ₦120,000';
      return '₦35,000 – ₦75,000 (Complete Teardown & Scrap Core)';
    } else if (department === 'ac') {
      if (workingCondition === 'working_good') return '₦80,000 – ₦160,000';
      if (workingCondition === 'working_with_faults') return '₦50,000 – ₦95,000';
      return '₦30,000 – ₦55,000';
    } else {
      // Sumo
      if (workingCondition === 'working_good') return '₦70,000 – ₦130,000';
      if (workingCondition === 'working_with_faults') return '₦40,000 – ₦80,000';
      return '₦25,000 – ₦45,000';
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
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
    if (!customerName.trim() || !customerPhone.trim() || !brandModel.trim()) {
      alert('Please fill in your name, phone, and equipment model.');
      return;
    }

    addSellRequest({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'seller@surevolt.ng',
      customerAddress,
      department,
      brandModel,
      workingCondition,
      issueDescription,
      photos: photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      ],
      estimatedOfferRange: getEstimatedOfferRange(),
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Sell Your Faulty or Used Machine</h3>
              <p className="text-xs text-slate-400">
                We buy good or bad equipment • Instant valuation & fast cash payout
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          {/* Department Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              1. Equipment Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDepartment('generators')}
                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                  department === 'generators'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Petrol Gen</span>
              </button>

              <button
                type="button"
                onClick={() => setDepartment('ac')}
                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                  department === 'ac'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Wind className="w-4 h-4 text-amber-600" />
                <span>Air Conditioner</span>
              </button>

              <button
                type="button"
                onClick={() => setDepartment('sumo')}
                className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                  department === 'sumo'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>Sumo Pump</span>
              </button>
            </div>
          </div>

          {/* Model & Make */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Brand & Model Name *
            </label>
            <input
              type="text"
              required
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="e.g. Sumec Firman 3.5kVA, Panasonic 1.5HP AC, Pedrollo 2HP Sumo..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Condition Options */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Current Operating State
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWorkingCondition('not_working')}
                className={`p-2 rounded-xl border text-center text-xs transition cursor-pointer ${
                  workingCondition === 'not_working'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-semibold">Not Working</span>
                <span className="text-[10px] text-slate-500">Knocked / Dead</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkingCondition('working_with_faults')}
                className={`p-2 rounded-xl border text-center text-xs transition cursor-pointer ${
                  workingCondition === 'working_with_faults'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-semibold">Has Faults</span>
                <span className="text-[10px] text-slate-500">Smoking / Tripping</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkingCondition('working_good')}
                className={`p-2 rounded-xl border text-center text-xs transition cursor-pointer ${
                  workingCondition === 'working_good'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="block font-semibold">Working Well</span>
                <span className="text-[10px] text-slate-500">Upgrade / Relocating</span>
              </button>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Describe Any Faults or History
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="State what is wrong, how long it was used, or reason for selling..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Upload Machine Photos
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="px-4 py-2 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl bg-slate-50 hover:bg-amber-50/50 cursor-pointer flex items-center gap-2 text-xs font-semibold text-slate-700 transition">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photos.map((src, idx) => (
                <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 group">
                  <img src={src} alt="Faulty unit" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Valuation Box */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Estimated Buyout Range
              </span>
              <span className="text-[11px] text-amber-800">
                Final cash offer confirmed following physical visual inspection.
              </span>
            </div>
            <span className="text-base sm:text-lg font-black text-amber-950 font-mono">
              {getEstimatedOfferRange()}
            </span>
          </div>

          {/* Seller Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Equipment Location (Lagos Address)
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="e.g. Ikeja, Surulere, Lekki, Ogba..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              Submit for Cash Valuation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
