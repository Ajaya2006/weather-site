import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface Props {
  lat: number;
  lon: number;
}

interface AQIData {
  main: { aqi: number };
  components: {
    pm2_5: number;
    pm10: number;
    so2?: number;
    co: number;
  };
}

const getAQILabel = (aqi: number): string => {
  switch (aqi) {
    case 1: return "Good";
    case 2: return "Lightly polluted";
    case 3: return "Moderate";
    case 4: return "Poor";
    case 5: return "Very poor";
    default: return "Unknown";
  }
};

type PollutantKey = "pm2_5" | "pm10" | "so2" | "co";

const MAX_VALUES: Record<PollutantKey, number> = {
  pm2_5: 500,
  pm10: 500,
  so2: 100,
  co: 50,
};

const SLIDER_COLORS: Record<PollutantKey, string> = {
  pm2_5: "#f97316", // orange-500
  pm10: "#eab308",  // yellow-500
  so2: "#22c55e",   // green-500
  co: "#eab308",    // yellow-500
};

export const AirQualityCard = ({ lat, lon }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lon == null) return;
    if (!API_KEY) {
      setError("Missing API key");
      return;
    }

    const fetchAQI = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          "https://api.openweathermap.org/data/2.5/air_pollution",
          { params: { lat, lon, appid: API_KEY } }
        );
        if (res.data?.list?.length > 0) {
          setAqiData(res.data.list[0]);
        } else {
          setError("No AQI data available");
        }
      } catch (err: any) {
        if (err.response?.status === 401) setError("Invalid API key");
        else setError("Failed to fetch AQI data");
      } finally {
        setLoading(false);
      }
    };

    fetchAQI();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">Loading AQI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!aqiData) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-sm">No AQI data</p>
      </div>
    );
  }

  const aqi = aqiData.main.aqi;
  const label = getAQILabel(aqi);

  // Map aqi (1-5) to angle in a 270° sweep (from 135° to 405°)
  const startAngle = 135;
  const endAngle = 405;
  const angleRange = endAngle - startAngle;
  const angle = startAngle + ((aqi - 1) / 4) * angleRange;
  const rad = (angle * Math.PI) / 180;

  const cx = 50;
  const cy = 50;
  const r = 40;
  const indicatorX = cx + r * Math.cos(rad);
  const indicatorY = cy + r * Math.sin(rad);

  const startRad = (135 * Math.PI) / 180;
  const endRad = (405 * Math.PI) / 180;
  const startX = cx + r * Math.cos(startRad);
  const startY = cy + r * Math.sin(startRad);
  const endX = cx + r * Math.cos(endRad);
  const endY = cy + r * Math.sin(endRad);

  const pollutants: Array<{ key: PollutantKey; name: string; value: number }> = [
    { key: "pm2_5", name: "PM2.5", value: aqiData.components.pm2_5 },
    { key: "pm10", name: "PM10", value: aqiData.components.pm10 },
    { key: "so2", name: "SO2", value: aqiData.components.so2 ?? 0 },
    { key: "co", name: "CO", value: aqiData.components.co },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="relative z-10 mb-4">
        <span className="text-sm text-gray-300">Air quality</span>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side: gauge with label and value inside */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {/* Background track */}
              <path
                d={`M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Colored gradient arc */}
              <path
                d={`M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* White indicator – animates on view */}
              <motion.circle
                r="6"
                fill="white"
                className="filter drop-shadow-lg"
                animate={
                  isInView
                    ? { cx: indicatorX, cy: indicatorY }
                    : { cx: startX, cy: startY }
                }
                transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
              />
            </svg>
            {/* Label and AQI value inside the gauge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white/80 text-[10px] tracking-wider uppercase text-center leading-tight">
                {label}
              </p>
              <p className="text-white text-xl font-light">{aqi}</p>
            </div>
          </div>
        </div>

        {/* Right side: pollutant readings */}
        <div className="flex-1 space-y-3">
          {pollutants.map((p, idx) => {
            const percentage = Math.min((p.value / MAX_VALUES[p.key]) * 100, 100);
            return (
              <div key={p.key} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{p.name}</span>
                  <span className="text-white font-medium">{Math.round(p.value)}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: SLIDER_COLORS[p.key] }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};