import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Sparkles, Palette, Sliders, Heart } from 'lucide-react';

const UspSection = () => {
  const sectionRef = useRef(null);
  const targetProgressRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

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
      
      const headerEl = sectionRef.current.querySelector('.usp-header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 200;

      // Card container is sticky at top-[90px] to clear the fixed navigation bar
      const stickyOffset = 90;
      const startOffset = headerHeight - stickyOffset;

      const stuckDistance = sectionHeight - windowHeight - startOffset;
      if (stuckDistance <= 0) return;

      const scrolled = -rect.top - startOffset;
      const progress = Math.min(Math.max(scrolled / stuckDistance, 0), 1);
      
      // Store in ref for smooth lerping
      targetProgressRef.current = progress;
    };

    // requestAnimationFrame Lerp loop for liquid-smooth inertia scroll animations
    let animationFrameId;
    let currentProgress = 0;

    const updateLoop = () => {
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

  // Compute slide-in progress for 5 cards sequentially
  // Card 2 slides from p = 0.05 to p = 0.25
  const p2 = Math.min(Math.max((scrollProgress - 0.05) / 0.20, 0), 1);
  // Card 3 slides from p = 0.25 to p = 0.45
  const p3 = Math.min(Math.max((scrollProgress - 0.25) / 0.20, 0), 1);
  // Card 4 slides from p = 0.45 to p = 0.65
  const p4 = Math.min(Math.max((scrollProgress - 0.45) / 0.20, 0), 1);
  // Card 5 slides from p = 0.65 to p = 0.85
  const p5 = Math.min(Math.max((scrollProgress - 0.65) / 0.20, 0), 1);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[400vh] lg:h-[600vh] bg-[#FAF9F6] border-t border-primary/10 font-outfit"
    >
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
          {isMobile ? (
            /* Mobile Vertical Scroll Stacking (highly premium!) */
            <div className="relative w-full max-w-[340px] h-[360px] mx-auto overflow-visible">
              {cards.map((card, index) => {
                const p = index === 0 ? 1 : index === 1 ? p2 : index === 2 ? p3 : index === 3 ? p4 : p5;
                
                // Card slides up vertically from the bottom of the container
                const translateY = (1 - p) * 450;
                const opacity = p;
                
                // Stack offset
                const topOffset = index * 40;

                return (
                  <div
                    key={card.id}
                    className={`absolute left-0 w-full h-[180px] rounded-[2rem] p-6 shadow-xl border border-black/5 flex flex-col justify-between overflow-hidden ${card.bg} ${card.textColor}`}
                    style={{
                      top: `${topOffset}px`,
                      transform: `translate3d(0, ${translateY}px, 0) scale(${0.95 + p * 0.05})`,
                      opacity: opacity,
                      zIndex: index + 1,
                      transition: 'none', // No CSS transition needed, requestAnimationFrame loop updates layout values fluidly
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
                      <div className={`w-8 h-8 rounded-full border ${card.borderColor} flex items-center justify-center bg-white/10 backdrop-blur-sm`}>
                        <card.icon className="w-4 h-4" />
                      </div>

                      {card.badge && (
                        <span className={`px-2.5 py-1 rounded-full border ${card.borderColor} text-[8px] font-extrabold uppercase tracking-wider bg-white/5 backdrop-blur-sm`}>
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
                );
              })}
            </div>
          ) : (
            /* Desktop Horizontal Overlapping Stack (5 fanned cards!) */
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
                    className={`w-[370px] h-[260px] rounded-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl border border-black/5 flex flex-col justify-between relative overflow-hidden shrink-0 ${card.bg} ${card.textColor}`}
                    style={{
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
                      <div className={`w-12 h-12 rounded-full border ${card.borderColor} flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-inner`}>
                        <card.icon className="w-5 h-5" />
                      </div>

                      {card.badge && (
                        <span className={`px-4 py-1.5 rounded-full border ${card.borderColor} text-[9px] font-extrabold uppercase tracking-widest bg-white/5 backdrop-blur-sm`}>
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
          )}
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
    </section>
  );
};

export default UspSection;
