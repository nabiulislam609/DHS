import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { siteSettings, setIsAdmissionModalOpen } = useSchool();

  const slides = [
    {
      badge: 'দাদরা উচ্চ বিদ্যালয়',
      title: 'শিক্ষাই জাতির মূল সম্পদ',
      subtitle: 'ছাত্রীর বলিষ্ঠ নেতৃত্বের ঐতিহ্য, আধুনিক শিক্ষার দীপ্তি',
      bgImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80',
    },
    {
      badge: 'মানসম্মত শিক্ষা',
      title: 'নৈতিকতা ও প্রযুক্তির যুগোপযোগী সমন্বয়',
      subtitle: 'আমাদের প্রতিটি শিক্ষার্থী আগামীর উদ্ভাবক ও দক্ষ পথপ্রদর্শক',
      bgImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80',
    },
    {
      badge: 'ঐতিহ্যের ৪৫ বছর',
      title: 'জ্ঞান ও মানবিকতায় সমৃদ্ধ এক ভবিষ্যৎ',
      subtitle: 'অভিজ্ঞ শিক্ষকমণ্ডলী ও আধুনিক বিজ্ঞানাগারের সর্বোচ্চ সুবিধা',
      bgImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section id="hero" className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] overflow-hidden bg-gray-900">
      {/* Background Image with Dark Greenish Overlay matching screenshot */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{
          backgroundImage: `url(${slide.bgImage})`,
        }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-black/75 to-emerald-950/70" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-4">
          {/* Badge */}
          <div className="inline-block bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium px-3.5 py-1 rounded-full backdrop-blur-xs">
            {slide.badge}
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
            {slide.title}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed max-w-xl drop-shadow-xs">
            {slide.subtitle}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-medium px-6 py-2.5 rounded-md shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>ভর্তি চলছে</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
