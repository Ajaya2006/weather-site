import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

interface Props {
  forecast: any;
  transparent?: boolean;
  isNight?: boolean;
}

interface HourData {
  time: string;
  temp: number;
  icon: string;
}

export const HourlyTrend = ({ forecast, isNight = false }: Props) => {
  const [data, setData] = useState<HourData[]>([]);

  useEffect(() => {
    if (!forecast?.list) return;

    const hourly = forecast.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
    }));

    setData(hourly);
  }, [forecast]);

  if (!data.length) return null;

  // Day/Night color scheme
  const bgColor = isNight ? "rgba(30, 30, 30, 0.5)" : "rgba(255, 255, 255, 0.3)";
  const textColor = isNight ? "#f0f0f0" : "#1f2937"; // light vs dark text
  const gridColor = isNight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="rounded-3xl p-6 backdrop-blur-xl border border-white/20"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Hourly Trend
      </h3>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[600px]">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

              <XAxis
                dataKey="time"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
              />

              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "12px",
                  color: textColor,
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke={isNight ? "#22c55e" : "#16a34a"}
                strokeWidth={4}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        {data.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
              alt=""
              className="w-7 h-7 opacity-80"
            />

            <span className="text-sm font-medium" style={{ color: textColor }}>
              {hour.time}
            </span>

            <span className="text-lg font-bold" style={{ color: textColor }}>
              {hour.temp}°
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};