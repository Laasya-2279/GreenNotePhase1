import React, { useRef, useEffect } from 'react';

// Aurora Waves Background for Public Signup (Teal-Lime-Purple Hue)
export default function AuroraWavesPublicBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let t = 0;
    function drawAurora() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.22 + i * 0.08;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const freq = 0.0012 + i * 0.0005;
          const amp = 60 + i * 24;
          const y =
            height * 0.5 +
            Math.sin(x * freq + t * (0.7 + i * 0.2) + i * 1.2) * amp +
            Math.cos(x * 0.0007 + t * (1.1 + i * 0.3)) * 18 +
            (mouse.current.x - width / 2) * 0.01 * (i + 1);
          ctx.lineTo(x, y + (i - 1) * 32);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (i === 0) {
          grad.addColorStop(0, '#14b8a6'); // teal
          grad.addColorStop(0.5, '#a3e635'); // lime
          grad.addColorStop(1, '#a21caf'); // purple
        } else if (i === 1) {
          grad.addColorStop(0, '#a3e635');
          grad.addColorStop(0.5, '#a21caf');
          grad.addColorStop(1, '#14b8a6');
        } else {
          grad.addColorStop(0, '#a21caf');
          grad.addColorStop(0.5, '#14b8a6');
          grad.addColorStop(1, '#a3e635');
        }
        ctx.fillStyle = grad;
        ctx.filter = 'blur(8px)';
        ctx.fill();
        ctx.restore();
      }
      t += 0.012;
      animationRef.current = requestAnimationFrame(drawAurora);
    }
    drawAurora();

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
