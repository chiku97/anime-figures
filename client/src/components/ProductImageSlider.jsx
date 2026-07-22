import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageSlider = ({
  images = [],
  alt = 'Product image',
  interval = 2000, // Auto-slide every 2 seconds
  className = '',
  imgClassName = 'object-cover w-full h-full',
  showControls = true,
  showDots = true,
  onClick = null,
}) => {
  // Normalize images array
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : ['https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch & Mouse drag states for swipe detection
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  // Automatic 2-second sliding effect
  useEffect(() => {
    if (validImages.length <= 1 || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, interval, isPaused, isDragging]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleDotClick = (e, index) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 35; // Minimum px to count as swipe

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Image
      handlePrev();
    }
  };

  // Mouse Swipe Handlers for Desktop Dragging
  const handleMouseDown = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    setTouchStartX(e.clientX);
    setTouchEndX(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEndX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
    if (isDragging && touchStartX && touchEndX) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 35;
      if (distance > minSwipeDistance) {
        handleNext();
      } else if (distance < -minSwipeDistance) {
        handlePrev();
      }
    }
    setIsDragging(false);
  };

  // Single Image Rendering (No slider controls needed)
  if (validImages.length <= 1) {
    return (
      <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
        <img src={validImages[0]} alt={alt} className={imgClassName} />
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={`relative overflow-hidden group select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      {/* Sliding Images Reel */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {validImages.map((src, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            <img src={src} alt={`${alt} - view ${idx + 1}`} className={imgClassName} draggable={false} />
          </div>
        ))}
      </div>

      {/* Image Count Indicator Badge */}
      {validImages.length > 1 && (
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-black/60 backdrop-blur border border-white/20 text-white font-mono text-[10px] font-bold rounded-md shadow">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}

      {/* Navigation Arrow Controls */}
      {showControls && validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur border border-white/10">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(e, idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
