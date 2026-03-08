import { useMemo } from "react";

interface Props {
  intensity?: number;
  dark?: boolean;
}

export const RainBackground = ({
  intensity = 120,
  dark = false,
}: Props) => {
  const drops = useMemo(() => {
    return new Array(intensity).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 0.5 + 0.6,
      opacity: Math.random() * 0.5 + 0.4,
      size: Math.random() * 18 + 14,
    }));
  }, [intensity]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-slate-900 via-gray-900 to-black"
            : "bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800"
        }`}
      />

      {/* RAIN */}
      {drops.map((d) => (
        <div
          key={d.id}
          className="rainDrop"
          style={{
            left: `${d.left}%`,
            height: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
};