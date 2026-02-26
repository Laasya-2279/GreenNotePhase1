import React, { useRef, useEffect } from 'react';

// Interactive animated particles/aurora background
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particles = useRef([]);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Particle config
  const PARTICLE_COUNT = 36;
  const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 32 + Math.random() * 32,
      color: COLORS[i % COLORS.length],
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      alpha: 0.18 + Math.random() * 0.18
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);
      // Draw aurora/particles
      for (let p of particles.current) {
        // Interactive: move slightly toward mouse
        p.x += p.dx + (mouse.current.x - p.x) * 0.0005;
        p.y += p.dy + (mouse.current.y - p.y) * 0.0005;
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
        // Draw
        ctx.save();
        ctx.globalAlpha = p.alpha;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    // Mouse interaction
    function onMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none animate-fade-in"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
