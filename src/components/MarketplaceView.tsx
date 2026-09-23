import React, { useState } from 'react';
import {
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Search,
  Wrench,
  Flame,
  Wind,
  Droplets,
  DollarSign,
  Camera,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/categorization';
import { EquipmentProduct, Department, EquipmentCondition } from '../types';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    setActiveModal,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
  } = useApp();

  const [conditionFilter, setConditionFilter] = useState<'all' | EquipmentCondition>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedDepartmentFilter !== 'all' && p.department !== selectedDepartmentFilter) {
      return false;
    }
    if (conditionFilter !== 'all' && p.condition !== conditionFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.modelNumber.toLowerCase().includes(q) ||
        p.capacity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBuy = (product: EquipmentProduct) => {
    setSelectedProduct(product);
    setActiveModal('payment');
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Banner & Sell Equipment CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 px-3 py-1 bg-amber-400/20 rounded-full inline-block">
                Tested & Trusted Equipment Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Buy Brand New & Grade-A Certified Equipment. Or Sell Your Faulty Machine.
              </h1>
              <p className="text-sm text-slate-300">
                Whether you want factory sealed units or fully overhauled machines tested on our load bank with warranty.
                We also buy your used or faulty petrol gens, ACs, and pumps at top cash value!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => setActiveModal('sell')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Sell Your Faulty Equipment</span>
              </button>

              <button
                onClick={() => setActiveModal('booking')}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Book a Repair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Department Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedDepartmentFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedDepartmentFilter === 'all'
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Equipment ({products.length})
            </button>

            <button
              onClick={() => setSelectedDepartmentFilter('generators')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDepartmentFilter === 'generators'
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Petrol Generators</span>
            </button>

            <button
              onClick={() => setSelectedDepartmentFilter('ac')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDepartmentFilter === 'ac'
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Air Conditioners</span>
            </button>

            <button
              onClick={() => setSelectedDepartmentFilter('sumo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedDepartmentFilter === 'sumo'
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Sumo Pumps</span>
            </button>
          </div>

          {/* Condition Toggle & Search */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setConditionFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  conditionFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setConditionFilter('brand_new')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  conditionFilter === 'brand_new'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Brand New
              </button>
              <button
                onClick={() => setConditionFilter('fairly_used')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  conditionFilter === 'fairly_used'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tested Fairly Used
              </button>
            </div>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search kVA, model, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Header */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow ${
                        product.condition === 'brand_new'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {product.condition === 'brand_new' ? 'Brand New' : 'Tested & Trusted Used'}
                    </span>
                    {product.conditionRating && (
                      <span className="text-[10px] font-bold bg-slate-900/80 text-white px-2 py-1 rounded-md backdrop-blur-xs">
                        {product.conditionRating}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                    {product.capacity}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold uppercase">{product.brand}</span>
                      <span className="font-mono">{product.modelNumber}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Specs Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.specs.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          ✓ {spec}
                        </span>
                      ))}
                    </div>

                    {/* Tested Checklist */}
                    {product.testedChecklist && product.testedChecklist.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                        <span className="font-bold text-slate-700 block">Surevolt Workshop QA:</span>
                        {product.testedChecklist.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Buy Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {product.warranty}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">
                          {formatNaira(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatNaira(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuy(product)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Unit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No equipment found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your department filter or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
