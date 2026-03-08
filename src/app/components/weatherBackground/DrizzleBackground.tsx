import { useMemo } from "react";

interface Props {
  intensity?: number;
  dark?: boolean;
}

export const DrizzleBackground = ({
  intensity = 70,
  dark = false,
}: Props) => {
  const drops = useMemo(() => {
    return new Array(intensity).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 1.2 + 1.5,
      opacity: Math.random() * 0.4 + 0.3,
    }));
  }, [intensity]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 ${
            dark
            ? "bg-gradient-to-b from-slate-800 via-slate-900 to-black"
            : "bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500"
        }`}
      />

      {/* DRIZZLE */}
      {drops.map((d) => (
        <div
          key={d.id}
          className={`drizzleDrop ${dark ? "drizzle-night" : "drizzle-day"}`}
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
};