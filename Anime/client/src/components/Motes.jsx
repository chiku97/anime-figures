import React, { useEffect, useRef } from 'react';

const Motes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set dimensions
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = (canvas?.height || window.innerHeight) + Math.random() * 50;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Horizontal drift fluctuation
        this.speedX += (Math.random() * 0.02 - 0.01);

        // Boundary checks
        if (this.y < -10 || this.x < -10 || this.x > (canvas?.width || window.innerWidth) + 10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ff0055'; // Neon pink motes for styling accent
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff007f';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      // Distribute particles across canvas height initially
      p.y = Math.random() * (canvas.height || window.innerHeight);
      particles.push(p);
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      ctx = null; // Nullify canvas context to prevent leaks
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default Motes;
