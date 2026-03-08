import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const SmokeBackground = ({ dark = false }: Props) => {
  const particles = useMemo(() => {
    return new Array(50).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 120 + 80,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms] ${
        dark ? "bg-gray-900" : "bg-gray-700"
      }`}
    >

      {/* BASE SMOKE HAZE */}
      <div
        className={`absolute inset-0 blur-3xl ${
          dark ? "bg-gray-800/30" : "bg-gray-500/20"
        }`}
      />

      {/* SMOKE PARTICLES */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="smokeParticle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};