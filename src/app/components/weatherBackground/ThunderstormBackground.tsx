import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const ThunderstormBackground = ({ dark = false }: Props) => {
  const rain = useMemo(() => {
    return new Array(150).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 0.8 + 0.5,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.6 + 0.3,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms] ${
        dark ? "bg-gray-950" : "bg-gray-800"
      }`}
    >

      {/* STORM CLOUDS */}
      <div
        className={`absolute inset-0 blur-3xl ${
          dark ? "bg-gray-900/60" : "bg-gray-800/40"
        }`}
      />

      {/* RAIN */}
      {rain.map((r) => (
        <div
          key={r.id}
          className="rainDrop"
          style={{
            left: `${r.left}%`,
            animationDuration: `${r.duration}s`,
            animationDelay: `${r.delay}s`,
            opacity: r.opacity,
          }}
        />
      ))}

      {/* LIGHTNING FLASH */}
      <div className="lightningFlash" />
    </div>
  );
};