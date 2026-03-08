import { ClearBackground } from "./ClearBackground";
import { CloudsBackground } from "./CloudsBackground";
import { RainBackground } from "./RainBackground";
import { DrizzleBackground } from "./DrizzleBackground";
import { ThunderstormBackground } from "./ThunderstormBackground";
import { SnowBackground } from "./SnowBackground";
import { MistBackground } from "./MistBackground";
import { SmokeBackground } from "./SmokeBackground";
import { HazeBackground } from "./HazeBackground";
import { DustBackground } from "./DustBackground";
import { FogBackground } from "./FogBackground";
import { SandBackground } from "./SandBackground";
import { AshBackground } from "./AshBackground";
import { SquallBackground } from "./SquallBackground";
import { TornadoBackground } from "./TornadoBackground";

import { useMemo } from "react";
import type { JSX } from "react";

interface Props {
  condition?: string;
  sunrise?: number;
  sunset?: number;
  phase?: "day" | "night" | "sunrise" | "sunset";
}

const backgroundMap: Record<string, JSX.Element> = {
  Thunderstorm: <ThunderstormBackground />,
  Drizzle: <DrizzleBackground />,
  Rain: <RainBackground />,
  Snow: <SnowBackground />,
  Mist: <MistBackground />,
  Smoke: <SmokeBackground />,
  Haze: <HazeBackground />,
  Dust: <DustBackground />,
  Fog: <FogBackground />,
  Sand: <SandBackground />,
  Ash: <AshBackground />,
  Squall: <SquallBackground />,
  Tornado: <TornadoBackground />,
  Clouds: <CloudsBackground />,
  Clear: <ClearBackground />,
};

export const WeatherBackground = ({
  condition,
  sunrise,
  sunset,
  phase,
}: Props) => {
  const now = Date.now() / 1000;

  // Night detection (strong)
  let dark =
    phase === "night" ||
    phase === "sunset" ||
    (sunset ? now > sunset : false);

  // 🌟 Improved gradients (day default)
  let skyGradient =
    "bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500";

  // 🌙 Night gradient (dark premium)
  if (dark) {
    skyGradient =
      "bg-gradient-to-b from-gray-900 via-gray-800 to-black";
  }

  // 🌅 Sunrise / Sunset transitions
  if (sunrise && sunset) {
    const sunriseStart = sunrise - 1800;
    const sunriseEnd = sunrise + 1800;

    const sunsetStart = sunset - 1800;
    const sunsetEnd = sunset + 1800;

    if (now >= sunriseStart && now <= sunriseEnd) {
      skyGradient =
        "bg-gradient-to-b from-red-500 via-orange-400 to-yellow-300";
      dark = false;
    } else if (now >= sunsetStart && now <= sunsetEnd) {
      skyGradient =
        "bg-gradient-to-b from-red-600 via-purple-700 to-indigo-900";
    } else if (now > sunriseEnd && now < sunsetStart) {
      skyGradient =
        "bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500";
      dark = false;
    }
  }

  // 🌟 Optimized stars (only when needed)
  const stars = useMemo(() => {
    if (!dark) return [];

    return new Array(35).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, [dark]);

  // 🌧️ Weather effect (dark clouds at night)
  let WeatherEffect =
    backgroundMap[condition || ""] || <ClearBackground />;

  if (condition === "Clouds") {
    WeatherEffect = dark ? (
      <CloudsBackground dark animated />
    ) : (
      <CloudsBackground />
    );
  }

  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden ${skyGradient}`}
      style={{ willChange: "transform" }} // performance boost
    >
      {/* 🌙 Moon (night only) */}
      {dark && (
        <div className="moon">
          <div
            className="moonShadow"
            style={{
              transform: `translateX(${getMoonPhase() * 30}px)`,
            }}
          />
        </div>
      )}

      {/* ✨ Stars (night only) */}
      {stars.map((s) => (
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

      {/* 🌧️ Weather effect */}
      {WeatherEffect}
    </div>
  );
};

// 🌙 Moon phase math (unchanged)
function getMoonPhase() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  let r = year % 100;
  r %= 19;
  if (r > 9) r -= 19;

  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;

  return (r < 0 ? r + 30 : r) / 30;
}