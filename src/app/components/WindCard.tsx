import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Cloud,
  CloudSnow,
  CloudRain,
  CloudLightning,
  CloudFog,
} from "lucide-react";

interface Props {
  speed: number;
  deg: number;
  condition?: string;
}

const getBeaufort = (speed: number): number => {
  if (speed < 0.3) return 0;
  if (speed < 1.6) return 1;
  if (speed < 3.4) return 2;
  if (speed < 5.5) return 3;
  if (speed < 8.0) return 4;
  if (speed < 10.8) return 5;
  if (speed < 13.9) return 6;
  if (speed < 17.2) return 7;
  if (speed < 20.8) return 8;
  if (speed < 24.5) return 9;
  if (speed < 28.5) return 10;
  if (speed < 32.7) return 11;
  return 12;
};

const getDirection = (deg: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(deg / 22.5) % 16];
};

const WeatherIcon = ({ condition }: { condition?: string }) => {
  const cond = condition?.toLowerCase() || "";
  if (cond.includes("thunder") || cond.includes("storm"))
    return <CloudLightning className="w-5 h-5 text-white/80" />;
  if (cond.includes("rain"))
    return <CloudRain className="w-5 h-5 text-white/80" />;
  if (cond.includes("snow"))
    return <CloudSnow className="w-5 h-5 text-white/80" />;
  if (cond.includes("cloud"))
    return <Cloud className="w-5 h-5 text-white/80" />;
  if (cond.includes("fog") || cond.includes("mist"))
    return <CloudFog className="w-5 h-5 text-white/80" />;
  return (
    <div className="flex items-center gap-0.5">
      <Cloud className="w-4 h-4 text-white/80" />
      <Cloud className="w-4 h-4 text-white/80" />
      <Cloud className="w-4 h-4 text-white/80" />
      <CloudSnow className="w-4 h-4 text-white/80" />
    </div>
  );
};

export const WindCard = ({ speed, deg, condition }: Props) => {
  const [force, setForce] = useState(getBeaufort(speed));
  const [dirLabel, setDirLabel] = useState(getDirection(deg));
  const [targetDeg, setTargetDeg] = useState(deg);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    setForce(getBeaufort(speed));
    setDirLabel(getDirection(deg));
    setTargetDeg(deg);
  }, [deg, speed]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">{dirLabel}</span>
        <WeatherIcon condition={condition} />
      </div>

      <div className="relative w-32 h-32 mx-auto">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-white/20" />

        {/* Cardinal points */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">N</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs text-gray-400">S</span>
        <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">W</span>
        <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">E</span>

        {/* Intermediate dots */}
        <span className="absolute top-[15%] right-[15%] w-1 h-1 bg-gray-400 rounded-full" />
        <span className="absolute bottom-[15%] right-[15%] w-1 h-1 bg-gray-400 rounded-full" />
        <span className="absolute bottom-[15%] left-[15%] w-1 h-1 bg-gray-400 rounded-full" />
        <span className="absolute top-[15%] left-[15%] w-1 h-1 bg-gray-400 rounded-full" />

        {/* Central circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-18 h-18 rounded-full bg-white/10 flex items-center justify-center shadow-lg">
            <span className="text-base font-bold text-white">Force {force}</span>
          </div>
        </div>

        {/* Needle – left end at pivot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-14 h-0.5 bg-cyan-400 origin-left"
          style={{ transform: "translateY(-50%)" }}
          animate={{ rotate: isInView ? targetDeg : 0 }}
          transition={{
            type: "spring",
            stiffness: 40,      // reduced stiffness for slower motion
            damping: 20,         // increased damping for smoother deceleration
            delay: 0.3,          // slight delay before starting
          }}
          // Idle oscillation while in view
          whileInView={{
            rotate: [targetDeg - 2, targetDeg + 2, targetDeg],
            transition: {
              duration: 1.5,      // slower oscillation
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1.5,         // longer delay after spring settles
            },
          }}
        />

        {/* Pivot dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
      </div>

      <div className="text-center text-xs text-gray-400 mt-3">{speed} m/s</div>
    </motion.div>
  );
};