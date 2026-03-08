import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const MistBackground = ({ dark = false }: Props) => {
  // Generate mist layers
  const mistLayers = useMemo(() => {
    return new Array(4).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 80,
      opacity: Math.random() * 0.35 + 0.2,
      duration: Math.random() * 50 + 40,
      delay: Math.random() * 20,
      scale: Math.random() * 0.6 + 0.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-slate-800 via-gray-900 to-black"
            : "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400"
        }`}
      />

      {/* MIST LAYERS */}
      {mistLayers.map((layer) => (
        <div
          key={layer.id}
          className="mistLayer"
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