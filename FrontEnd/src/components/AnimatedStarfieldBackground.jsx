import React, { useEffect, useRef } from 'react';

// Animated starfield background for select role page
export default function AnimatedStarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Star properties
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + Math.random() * 1.7,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.18,
      alpha: 0.7 + Math.random() * 0.3,
    }));

    function drawStar(star) {
      ctx.save();
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    function animateStars() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        drawStar(star);
        star.x += star.dx;
        star.y += star.dy;
        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;
        if (star.y > height) star.y = 0;
        if (star.y < 0) star.y = height;
      });
      animationFrame = requestAnimationFrame(animateStars);
    }
    animateStars();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
