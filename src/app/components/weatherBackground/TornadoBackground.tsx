import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const TornadoBackground = ({ dark = false }: Props) => {
  const debris = useMemo(() => {
    return new Array(40).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms] ${
        dark ? "bg-gray-900" : "bg-gray-800"
      }`}
    >

      {/* STORM ATMOSPHERE */}
      <div
        className={`absolute inset-0 blur-3xl ${
          dark ? "bg-gray-900/50" : "bg-gray-700/40"
        }`}
      />

      {/* TORNADO FUNNEL */}
      <div className="tornadoFunnel" />

      {/* FLYING DEBRIS */}
      {debris.map((d) => (
        <div
          key={d.id}
          className="tornadoDebris"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
};