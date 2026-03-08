import { useMemo } from "react";

interface Props {
  dark?: boolean;
  animated?: boolean;
}

export const CloudsBackground = ({ dark = false, animated = true }: Props) => {
  const clouds = useMemo(() => {
    return new Array(6).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 250 + 40,
      scale: Math.random() * 0.8 + 0.6,
      delay: Math.random() * 60,
      duration: Math.random() * 60 + 60,
    }));
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-slate-900 via-blue-900 to-black"
            : "bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200"
        }`}
      />

      {/* CLOUDS */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className={`cloud ${animated ? "animate-cloud" : ""} ${
            dark ? "cloud-dark" : ""
          }`}
          style={{
            top: c.top,
            left: "-250px",
            transform: `scale(${c.scale})`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
    </div>
  );
};