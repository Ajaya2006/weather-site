import { useMemo } from "react";

interface Props {
  intensity?: number;
    dark?: boolean;
}

export const DustBackground = ({
  intensity = 80,
  dark = false,
}: Props) => {
  const particles = useMemo(() => {
    return new Array(intensity).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, [intensity]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-yellow-900 via-orange-900 to-black"
            : "bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-300"
        }`}
      />

      {/* ATMOSPHERIC DUST LAYER */}
      <div
        className={`absolute inset-0 blur-2xl ${
          dark ? "bg-yellow-900/20" : "bg-yellow-200/20"
        }`}
      />

      {/* DUST PARTICLES */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="dustParticle"
          style={{
            top: `${p.top}%`,
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