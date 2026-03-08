import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const HazeBackground = ({ dark = false }: Props) => {
  // Generate multiple haze layers
  const hazeLayers = useMemo(() => {
    return new Array(4).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 80,
      opacity: Math.random() * 0.25 + 0.15,
      duration: Math.random() * 80 + 60,
      delay: Math.random() * 20,
      scale: Math.random() * 0.5 + 0.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-slate-700 via-gray-700 to-gray-900"
            : "bg-gradient-to-b from-yellow-200 via-yellow-100 to-gray-200"
        }`}
      />

      {/* ATMOSPHERIC GLOW */}
      <div
        className={`absolute inset-0 blur-3xl ${
          dark ? "bg-gray-700/10" : "bg-white/10"
        }`}
      />

      {/* HAZE LAYERS */}
      {hazeLayers.map((layer) => (
        <div
          key={layer.id}
          className="hazeLayer"
          style={{
            top: `${layer.top}%`,
            opacity: layer.opacity,
            transform: `scale(${layer.scale})`,
            animationDuration: `${layer.duration}s`,
            animationDelay: `${layer.delay}s`,
          }}
        />
      ))}
    </div>
  );
};