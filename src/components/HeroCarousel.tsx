import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Truck,
  Wrench,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroCarousel: React.FC = () => {
  const { settings, setActiveModal, setActiveTab } = useApp();
  const slides = settings.bannerSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleCta = (action: 'book' | 'buy' | 'sell') => {
    if (action === 'book') {
      setActiveModal('booking');
    } else if (action === 'buy') {
      setActiveTab('marketplace');
    } else if (action === 'sell') {
      setActiveModal('sell');
    }
  };

  if (!slides || slides.length === 0) return null;

  const current = slides[currentIndex];

  return (
    <div className="relative w-full bg-slate-950 overflow-hidden">
      {/* Slide Viewport */}
      <div
        className="relative h-[480px] sm:h-[520px] lg:h-[580px] w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Rich Dark Gradient */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
                  <Award className="w-4 h-4" />
                  <span>{slide.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleCta(slide.ctaAction)}
                    className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    onClick={() => setActiveModal('booking')}
                    className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base rounded-xl border border-slate-700 active:scale-95 transition-all backdrop-blur-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Instant Price Estimate</span>
                  </button>

                  <button
                    onClick={() => setActiveModal('sell')}
                    className="px-4 py-3.5 text-amber-300 hover:text-amber-200 font-semibold text-sm sm:text-base hover:underline transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Sell Faulty Equipment &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700/50 backdrop-blur-xs transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700/50 backdrop-blur-xs transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Proof Highlights Strip */}
      <div className="bg-slate-900 border-t border-b border-slate-800 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-2 md:pt-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xl lg:text-2xl">
              <Clock className="w-5 h-5" />
              <span>{settings.workingHours}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Daily Engineering Response</span>
          </div>

          <div className="pt-2 md:pt-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xl lg:text-2xl">
              <ShieldCheck className="w-5 h-5" />
              <span>Since {settings.operatingSince}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Zero Bad Record Commitment</span>
          </div>

          <div className="pt-2 md:pt-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-white font-black text-xl lg:text-2xl">
              <Truck className="w-5 h-5 text-amber-400" />
              <span>3 Delivery Modes</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Home • Pickup & Return • Workshop</span>
          </div>

          <div className="pt-2 md:pt-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-white font-black text-xl lg:text-2xl">
              <span className="text-amber-400">24h</span>
              <span>Refund Guarantee</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Cancel within 6–12 hrs for 100% refund</span>
          </div>
        </div>
      </div>
    </div>
  );
};
