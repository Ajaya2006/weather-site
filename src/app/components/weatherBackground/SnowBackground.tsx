import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const SnowBackground = ({ dark = false }: Props) => {
  const flakes = useMemo(() => {
    return new Array(90).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms] ${
        dark ? "bg-slate-800" : "bg-slate-400"
      }`}
    >

      {/* ATMOSPHERE HAZE */}
      <div
        className={`absolute inset-0 blur-2xl ${
          dark ? "bg-white/5" : "bg-white/10"
        }`}
      />

      {/* SNOW FLAKES */}
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snowFlake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
};