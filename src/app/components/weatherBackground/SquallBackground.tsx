import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const SquallBackground = ({ dark = false }: Props) => {
  const lines = useMemo(() => {
    return new Array(30).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      width: Math.random() * 200 + 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms] ${
        dark ? "bg-gray-900" : "bg-gray-500"
      }`}
    >

      {/* STORM HAZE */}
      <div
        className={`absolute inset-0 blur-2xl ${
          dark ? "bg-white/5" : "bg-white/10"
        }`}
      />

      {/* WIND LINES */}
      {lines.map((l) => (
        <div
          key={l.id}
          className="windLine"
          style={{
            top: `${l.top}%`,
            width: `${l.width}px`,
            opacity: l.opacity,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
          }}
        />
      ))}
    </div>
  );
};