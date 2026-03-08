import { useMemo } from "react";

interface Props {
  intensity?: number;
  dark?: boolean;
}

export const AshBackground = ({ intensity = 60, dark = false }: Props) => {
  const particles = useMemo(() => {
    return new Array(intensity).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.6 + 0.3,
    }));
  }, [intensity]);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-1000 ${
        dark
          ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500"
      }`}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="ashParticle"
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