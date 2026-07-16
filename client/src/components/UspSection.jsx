import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Sparkles, Palette, Sliders, Heart } from 'lucide-react';

// Safelist of classes to prevent Tailwind CSS compiler from purging dynamic classes:
// bg-white bg-[#F2ECE2] bg-[#E2E7DF] bg-[#E3D5CD] bg-[#3D604C]
// text-[#1F1F1F] text-white border-[#1F1F1F]/10 border-white/15

const UspSection = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [progresses, setProgresses] = useState([0, 0, 0, 0, 0]);
  const targetProgressesRef = useRef([0, 0, 0, 0, 0]);
  const currentProgressesRef = useRef([0, 0, 0, 0, 0]);

  const cards = [
    {
      id: 'usp-1',
      number: '01',
      title: 'Precision Crafted',
      desc: 'Every product is manufactured using high-quality 3D printing technology with attention to detail.',
      bg: 'bg-white',
      textColor: 'text-[#1F1F1F]',
      borderColor: 'border-[#1F1F1F]/10',
      icon: Cpu,
      badge: '3D PRINTED',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-2',
      number: '02',
      title: 'Premium Finish',
      desc: 'Designed to look elegant, feel premium, and complement modern interiors.',
      bg: 'bg-[#F2ECE2]', // Beautiful warm beige sand
      textColor: 'text-[#1F1F1F]',
      borderColor: 'border-[#1F1F1F]/10',
      icon: Sparkles,
      badge: 'FINISH',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-3',
      number: '03',
      title: 'Unique Designs',
      desc: 'Exclusive creations you won’t find in traditional retail stores.',
      bg: 'bg-[#E2E7DF]', // Soft sage green highlight
      textColor: 'text-[#1F1F1F]',
      borderColor: 'border-[#1F1F1F]/10',
      icon: Palette,
      badge: 'DESIGNS',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-4',
      number: '04',
      title: 'Customizable',
      desc: 'Many products can be personalized with names, numbers, logos, or custom designs.',
      bg: 'bg-[#E3D5CD]', // Warm rust clay highlight
      textColor: 'text-[#1F1F1F]',
      borderColor: 'border-[#1F1F1F]/10',
      icon: Sliders,
      badge: 'CUSTOMIZABLE',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-5',
      number: '05',
      title: 'Made in India',
      desc: 'Designed and manufactured with passion using premium materials.',
      bg: 'bg-[#3D604C]', // Deep forest green
      textColor: 'text-white',
      borderColor: 'border-white/15',
      icon: Heart,
      badge: 'ORIGIN',
      watermarkColor: 'rgba(255,255,255,0.04)',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const parentSectionTop = window.scrollY + rect.top;
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const stickyOffset = window.innerWidth < 1024 ? 210 : 250;
      const wrapperStep = windowHeight * (window.innerWidth < 1024 ? 0.65 : 0.75);

      const newProgresses = cards.map((_, index) => {
        const startY = parentSectionTop + index * wrapperStep - stickyOffset;
        const progress = Math.min(Math.max((currentScroll - startY) / wrapperStep, 0), 1);
        return progress;
      });

      targetProgressesRef.current = newProgresses;
    };

    // requestAnimationFrame Lerp loop for liquid-smooth inertia scale animations
    let animationFrameId;
    
    const updateLoop = () => {
      const targets = targetProgressesRef.current;
      const speed = window.innerWidth < 1024 ? 0.05 : 0.03; // Smooth liquid transition speed
      let changed = false;

      const nextProgresses = currentProgressesRef.current.map((curr, idx) => {
        const target = targets[idx] || 0;
        const diff = target - curr;
        if (Math.abs(diff) > 0.0001) {
          changed = true;
          return curr + diff * speed;
        }
        return target;
      });

      if (changed) {
        currentProgressesRef.current = nextProgresses;
        setProgresses([...nextProgresses]);
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleResize();
    handleScroll();
    
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute active dot index based on which card is currently active (highest index with scrollProgress > 0)
  const activeDotIndex = progresses.reduce((acc, curr, idx) => {
    if (curr > 0.1) return idx;
    return acc;
  }, 0);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#FAF9F6] border-t border-primary/10 font-outfit pb-24"
    >
      {/* Sticky Section Header: Locks at top-[90px] (clear navbar) */}
      <div className="sticky top-[90px] text-center w-full z-20 pt-16 pb-8 bg-[#FAF9F6]/95 backdrop-blur-sm">
        <h2 className="text-3xl md:text-5xl font-black text-[#1F1F1F] uppercase tracking-wider">
          WHY CHOOSE FORMORA?
        </h2>
        <div className="w-20 h-1 bg-[#1F1F1F] mx-auto mt-3 mb-2 rounded-full" />
        <p className="text-xs md:text-sm text-[#8A8A8A] font-semibold uppercase tracking-widest">
          Precision Crafted, Exclusively Yours
        </p>
      </div>

      {/* Cards List in normal document flow */}
      <div className="max-w-[340px] md:max-w-[800px] mx-auto px-6 relative z-10 flex flex-col items-center">
        {cards.map((card, index) => {
          // Stacking progress is driven by the scroll progress of the next card in the deck
          const nextProgress = progresses[index + 1] || 0;
          
          // Interpolate transformations for visual depth
          const scale = 1 - nextProgress * 0.05;
          const translateY = -nextProgress * 25; // Push cards up slightly when stacked
          const opacity = 1 - nextProgress * 0.35; // Stays highly visible but faded

          return (
            <div 
              key={card.id}
              className="card-wrapper-sticky sticky w-full flex items-center justify-center pointer-events-none"
              style={{
                height: isMobile ? '65vh' : '75vh',
                top: isMobile ? '210px' : '250px',
              }}
            >
              <div
                className={`card pointer-events-auto w-full max-w-[340px] md:max-w-[640px] h-[190px] md:h-[220px] rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl border border-black/5 flex flex-col justify-between overflow-hidden relative ${card.bg} ${card.textColor}`}
                style={{
                  transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                  opacity: opacity,
                  transformOrigin: 'center top',
                  transition: 'none',
                  zIndex: index + 1,
                }}
              >
                {/* Watermark outline */}
                <div
                  className="absolute right-6 bottom-0 select-none pointer-events-none text-7xl md:text-9xl font-black leading-none z-0"
                  style={{
                    WebkitTextStroke: `1.5px ${card.watermarkColor}`,
                    color: 'transparent',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  {card.number}
                </div>

                {/* Top Row: Icon & Badge */}
                <div className="flex justify-between items-start w-full relative z-10">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border ${card.borderColor} flex items-center justify-center bg-white/10 backdrop-blur-sm`}>
                    <card.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>

                  {card.badge && (
                    <span className={`px-2.5 py-1 md:px-4 md:py-1.5 rounded-full border ${card.borderColor} text-[8px] md:text-[9px] font-extrabold uppercase tracking-wider bg-white/5 backdrop-blur-sm`}>
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Text content */}
                <div className="space-y-1 md:space-y-2.5 relative z-10 text-left">
                  <h3 className="text-base md:text-xl font-extrabold tracking-tight">
                    {card.title}
                  </h3>
                  <div className="w-full h-[1px] bg-current opacity-15" />
                  <p className="text-[11px] md:text-xs font-normal leading-relaxed opacity-85">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Progress Dots: Sticky at bottom */}
      <div className="sticky bottom-10 left-0 w-full flex justify-center items-center gap-2 z-20 pointer-events-none">
        <div className="flex justify-center items-center gap-2 px-4 py-2 bg-[#FAF9F6]/80 backdrop-blur-md rounded-full border border-black/5 shadow-sm">
          {cards.map((_, idx) => {
            const active = idx === activeDotIndex;
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${active ? 'w-6 bg-[#1F1F1F]' : 'w-1.5 bg-[#1F1F1F]/20'}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UspSection;
