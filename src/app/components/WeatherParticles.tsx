import { useEffect, useRef } from "react";

interface WeatherParticlesProps {
  condition?: string;
}

export const WeatherParticles = ({ condition = "" }: WeatherParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const lower = condition.toLowerCase();
    const isSnow = lower.includes("snow");
    const isRain = lower.includes("rain");

    if (!isSnow && !isRain) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const particleCount = isSnow ? 120 : 200;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedY: isSnow ? Math.random() * 1.2 + 0.4 : Math.random() * 3 + 3,
      speedX: isSnow ? Math.random() * 0.5 - 0.25 : Math.random() * 0.3 - 0.15,
      size: isSnow ? Math.random() * 3 + 1 : Math.random() * 1.2 + 0.4,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        if (isSnow) {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (isRain) {
          ctx.strokeStyle = "rgba(180,220,255,0.6)";
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 10, p.y + p.size * 6);
          ctx.stroke();
        }

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width || p.x < 0) {
          p.x = Math.random() * canvas.width;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [condition]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};