import { useMemo } from "react";

interface Props {
  dark?: boolean;
}

export const ClearBackground = ({ dark = false }: Props) => {
  // Generate a few light clouds (day only)
  const clouds = useMemo(() => {
    return new Array(3).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 200 + 60,
      scale: Math.random() * 0.6 + 0.8,
      delay: Math.random() * 30,
    }));
  }, []);

  // Generate stars (night only)
  const stars = useMemo(() => {
    if (!dark) return [];
    return new Array(35).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, [dark]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-all duration-[2000ms]">

      {/* SKY */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          dark
            ? "bg-gradient-to-b from-slate-900 via-blue-900 to-black"
            : "bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200"
        }`}
      />

      {/* SUN (day only) */}
      {!dark && <div className="sun" />}

      {/* MOON (night only) */}
      {dark && <div className="moon" />}

      {/* CLOUDS (day only) */}
      {!dark &&
        clouds.map((c) => (
          <div
            key={c.id}
            className="cloud animate-cloud"
            style={{
              top: c.top,
              left: "-200px",
              transform: `scale(${c.scale})`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}

      {/* STARS (night only) */}
      {dark &&
        stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
    </div>
  );
};