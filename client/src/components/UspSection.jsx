import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Sparkles, Palette, Sliders, Heart } from 'lucide-react';

const UspSection = () => {
  const sectionRef = useRef(null);
  const targetProgressRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [scaleFactor, setScaleFactor] = useState(1);
  
  // Progress tracking states for mobile vertical sticky stack
  const [progresses, setProgresses] = useState([0, 0, 0, 0, 0]);
  const targetProgressesRef = useRef([0, 0, 0, 0, 0]);
  const currentProgressesRef = useRef([0, 0, 0, 0, 0]);

  const cards = [
    {
      id: 'usp-1',
      number: '01',
      title: 'Precision Crafted',
      desc: 'Every product is manufactured using high-quality 3D printing technology with attention to detail.',
      bg: '#FFFFFF',
      textColor: '#1F1F1F',
      borderColor: 'rgba(31,31,31,0.1)',
      icon: Cpu,
      badge: '3D PRINTED',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-2',
      number: '02',
      title: 'Premium Finish',
      desc: 'Designed to look elegant, feel premium, and complement modern interiors.',
      bg: '#F2ECE2', // Beautiful warm beige sand
      textColor: '#1F1F1F',
      borderColor: 'rgba(31,31,31,0.1)',
      icon: Sparkles,
      badge: 'FINISH',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-3',
      number: '03',
      title: 'Unique Designs',
      desc: 'Exclusive creations you won’t find in traditional retail stores.',
      bg: '#E2E7DF', // Soft sage green highlight
      textColor: '#1F1F1F',
      borderColor: 'rgba(31,31,31,0.1)',
      icon: Palette,
      badge: 'DESIGNS',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-4',
      number: '04',
      title: 'Customizable',
      desc: 'Many products can be personalized with names, numbers, logos, or custom designs.',
      bg: '#E3D5CD', // Warm rust clay highlight
      textColor: '#1F1F1F',
      borderColor: 'rgba(31,31,31,0.1)',
      icon: Sliders,
      badge: 'CUSTOMIZABLE',
      watermarkColor: 'rgba(31,31,31,0.04)',
    },
    {
      id: 'usp-5',
      number: '05',
      title: 'Made in India',
      desc: 'Designed and manufactured with passion using premium materials.',
      bg: '#3D604C', // Deep forest green
      textColor: '#FFFFFF',
      borderColor: 'rgba(255,255,255,0.15)',
      icon: Heart,
      badge: 'ORIGIN',
      watermarkColor: 'rgba(255,255,255,0.04)',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      
      // Scale fanned stack on tablet-desktop screens to prevent horizontal clipping
      if (width >= 1024 && width < 1350) {
        setScaleFactor((width - 48) / 1300);
      } else {
        setScaleFactor(1);
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      if (window.innerWidth < 1024) {
        // Mobile scroll handler: individual sticky wrapper calculations
        const parentSectionTop = window.scrollY + rect.top;
        const currentScroll = window.scrollY;
        const stickyOffset = 210;
        const wrapperStep = windowHeight * 0.65;

        const newProgresses = cards.map((_, index) => {
          const startY = parentSectionTop + index * wrapperStep - stickyOffset;
          const progress = Math.min(Math.max((currentScroll - startY) / wrapperStep, 0), 1);
          return progress;
        });

        targetProgressesRef.current = newProgresses;
      } else {
        // Desktop scroll handler: single fanned layout lerp progress
        const headerEl = sectionRef.current.querySelector('.usp-header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 200;
        
        const stickyOffset = 90;
        const startOffset = headerHeight - stickyOffset;
        const stuckDistance = sectionHeight - windowHeight - startOffset;

        if (stuckDistance <= 0) return;

        const scrolled = -rect.top - startOffset;
        const progress = Math.min(Math.max(scrolled / stuckDistance, 0), 1);
        
        targetProgressRef.current = progress;
      }
    };

    // requestAnimationFrame Lerp loop for liquid-smooth inertia scroll animations
    let animationFrameId;
    let currentProgress = 0;

    const updateLoop = () => {
      const isMobileScreen = window.innerWidth < 1024;
      
      if (isMobileScreen) {
        const targets = targetProgressesRef.current;
        const speed = 0.05; // mobile scroll damping speed
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
      } else {
        const target = targetProgressRef.current;
        const speed = 0.015; // Slowed damping factor for more relaxed slide entry
        const diff = target - currentProgress;
        
        if (Math.abs(diff) > 0.0001) {
          currentProgress += diff * speed;
          setScrollProgress(currentProgress);
        } else if (currentProgress !== target) {
          currentProgress = target;
          setScrollProgress(currentProgress);
        }
      }
      
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleResize();
    handleScroll();
    
    // Start lerp frame loop
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute slide-in progress for 5 cards sequentially (for desktop fanned view)
  const p2 = Math.min(Math.max((scrollProgress - 0.05) / 0.20, 0), 1);
  const p3 = Math.min(Math.max((scrollProgress - 0.25) / 0.20, 0), 1);
  const p4 = Math.min(Math.max((scrollProgress - 0.45) / 0.20, 0), 1);
  const p5 = Math.min(Math.max((scrollProgress - 0.65) / 0.20, 0), 1);

  // Compute active dot index on mobile based on stacked cards progress
  const activeDotIndex = progresses.reduce((acc, curr, idx) => {
    if (curr > 0.1) return idx;
    return acc;
  }, 0);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#FAF9F6] border-t border-primary/10 font-outfit"
      style={{ height: isMobile ? 'auto' : '600vh' }}
    >
      {isMobile ? (
        /* Mobile View: Vertical Sticky Stacking (Design Drastic native sticky deck) */
        <div className="w-full pb-24">
          {/* Section Header: Sticky at the top */}
          <div className="sticky top-[90px] text-center w-full z-20 pt-16 pb-8 bg-[#FAF9F6]/95 backdrop-blur-sm">
            <h2 className="text-3xl font-black text-[#1F1F1F] uppercase tracking-wider">
              WHY CHOOSE FORMORA?
            </h2>
            <div className="w-20 h-1 bg-[#1F1F1F] mx-auto mt-3 mb-2 rounded-full" />
            <p className="text-xs text-[#8A8A8A] font-semibold uppercase tracking-widest">
              Precision Crafted, Exclusively Yours
            </p>
          </div>

          {/* Cards List in normal document flow */}
          <div className="max-w-[340px] mx-auto px-6 relative z-10 flex flex-col items-center">
            {cards.map((card, index) => {
              // Stacking progress is driven by the scroll progress of the next card in the deck
              const nextProgress = progresses[index + 1] || 0;
              
              // Interpolate transformations for visual depth
              const scale = 1 - nextProgress * 0.05;
              const translateY = -nextProgress * 20; // Push stacked cards up slightly
              const opacity = 1 - nextProgress * 0.35; // Stays highly visible but faded

              return (
                <div 
                  key={card.id}
                  className="card-wrapper-sticky sticky w-full flex items-center justify-center pointer-events-none"
                  style={{
                    height: '65vh',
                    top: '210px',
                  }}
                >
                  <div
                    className="card pointer-events-auto w-full h-[180px] rounded-[2rem] p-6 shadow-xl border flex flex-col justify-between overflow-hidden relative"
                    style={{
                      backgroundColor: card.bg,
                      color: card.textColor,
                      borderColor: card.borderColor,
                      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                      opacity: opacity,
                      transformOrigin: 'center top',
                      transition: 'none',
                      zIndex: index + 1,
                    }}
                  >
                    {/* Watermark outline */}
                    <div 
                      className="absolute right-4 bottom-0 select-none pointer-events-none text-6xl font-black leading-none z-0"
                      style={{
                        WebkitTextStroke: `1px ${card.watermarkColor}`,
                        color: 'transparent',
                        fontFamily: 'Outfit, sans-serif'
                      }}
                    >
                      {card.number}
                    </div>

                    {/* Top Row: Icon & Badge */}
                    <div className="flex justify-between items-start w-full relative z-10">
                      <div 
                        className="w-8 h-8 rounded-full border flex items-center justify-center bg-white/10 backdrop-blur-sm"
                        style={{ borderColor: card.borderColor }}
                      >
                        <card.icon className="w-4 h-4" />
                      </div>

                      {card.badge && (
                        <span 
                          className="px-2.5 py-1 rounded-full border text-[8px] font-extrabold uppercase tracking-wider bg-white/5 backdrop-blur-sm"
                          style={{ borderColor: card.borderColor }}
                        >
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Text content */}
                    <div className="space-y-1 relative z-10 text-left">
                      <h3 className="text-base font-extrabold tracking-tight">
                        {card.title}
                      </h3>
                      <div className="w-full h-[1px] bg-current opacity-15" />
                      <p className="text-[11px] font-normal leading-relaxed opacity-85">
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
        </div>
      ) : (
        /* Desktop View: original single-sticky-viewport horizontal fanned stack */
        <>
          {/* Section Header: Scrolls normally */}
          <div className="usp-header text-center max-w-xl mx-auto px-6 pt-20 pb-6 z-20">
            <h2 className="text-3xl md:text-5xl font-black text-[#1F1F1F] uppercase tracking-wider">
              WHY CHOOSE FORMORA?
            </h2>
            <div className="w-20 h-1 bg-[#1F1F1F] mx-auto mt-4 mb-3 rounded-full" />
            <p className="text-xs md:text-sm text-[#8A8A8A] font-semibold uppercase tracking-widest">
              Precision Crafted, Exclusively Yours
            </p>
          </div>

          {/* Sticky viewport container */}
          <div className="sticky top-[90px] h-[calc(100vh-90px)] w-full overflow-hidden flex flex-col justify-center lg:justify-between py-8 lg:py-16">
            
            {/* Dynamic Cards Layout */}
            <div className="flex-grow flex items-center justify-center px-6 relative w-full overflow-visible">
              <div 
                className="flex items-start justify-center w-full relative z-10 transition-transform duration-100 py-6"
                style={{
                  transform: `scale(${scaleFactor})`,
                  transformOrigin: 'center center'
                }}
              >
                {cards.map((card, index) => {
                  const p = index === 0 ? 1 : index === 1 ? p2 : index === 2 ? p3 : index === 3 ? p4 : p5;
                  
                  // Cards slide in horizontally from the right
                  const translateX = (1 - p) * 600;
                  const opacity = p;
                  
                  // Negative margins generate horizontal overlap; margins shift down vertically
                  const marginLeft = index === 0 ? '0px' : '-130px';
                  const marginTop = index === 0 ? '0px' : `${index * 35}px`;

                  return (
                    <div
                      key={card.id}
                      className="w-[370px] h-[260px] rounded-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl border flex flex-col justify-between relative overflow-hidden shrink-0"
                      style={{
                        backgroundColor: card.bg,
                        color: card.textColor,
                        borderColor: card.borderColor,
                        transform: `translate3d(${translateX}px, 0, 0) scale(${0.95 + p * 0.05})`,
                        opacity: opacity,
                        marginLeft: marginLeft,
                        marginTop: marginTop,
                        zIndex: index + 1,
                        transition: 'none', // requestAnimationFrame handles frame interpolation instantly
                      }}
                    >
                      {/* Watermark outline */}
                      <div 
                        className="absolute right-8 bottom-0 select-none pointer-events-none text-[8rem] font-black leading-none z-0"
                        style={{
                          WebkitTextStroke: `1.5px ${card.watermarkColor}`,
                          color: 'transparent',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      >
                        {card.number}
                      </div>

                      {/* Top Row: Icon container & badge */}
                      <div className="flex justify-between items-start w-full relative z-10">
                        <div 
                          className="w-12 h-12 rounded-full border flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-inner"
                          style={{ borderColor: card.borderColor }}
                        >
                          <card.icon className="w-5 h-5" />
                        </div>

                        {card.badge && (
                          <span 
                            className="px-4 py-1.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest bg-white/5 backdrop-blur-sm"
                            style={{ borderColor: card.borderColor }}
                          >
                            {card.badge}
                          </span>
                        )}
                      </div>

                      {/* Bottom Row: Text content */}
                      <div className="space-y-2.5 relative z-10 text-left">
                        <h3 className="text-xl font-extrabold tracking-tight">
                          {card.title}
                        </h3>
                        
                        {/* Divider */}
                        <div className={`w-full h-[1px] bg-current opacity-15`} />

                        <p className="text-xs md:text-sm font-normal max-w-xl leading-relaxed opacity-85">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scroll Progress Dots */}
            <div className="flex justify-center items-center gap-2 px-6 z-20 mt-4">
              {cards.map((_, idx) => {
                const active = idx === 0 ? true : idx === 1 ? p2 > 0.5 : idx === 2 ? p3 > 0.5 : idx === 3 ? p4 > 0.5 : p5 > 0.5;
                return (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${active ? 'w-6 bg-[#1F1F1F]' : 'w-1.5 bg-[#1F1F1F]/20'}`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default UspSection;
