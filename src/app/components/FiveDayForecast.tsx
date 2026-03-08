import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from "lucide-react";

interface Props {
  forecast: any;
}

interface DayData {
  day: string;           // displayed as "MM/DD"
  label: string;         // "Yesterday", "Today", "Tomorrow", "Mon", "Tue", etc.
  high: number;
  low: number;
  iconCode: string;
}

const getWeatherIcon = (code: string) => {
  const iconMap: { [key: string]: any } = {
    "01d": Sun,
    "01n": Sun,
    "02d": CloudSun,
    "02n": CloudSun,
    "03d": Cloud,
    "03n": Cloud,
    "04d": Cloud,
    "04n": Cloud,
    "09d": CloudRain,
    "09n": CloudRain,
    "10d": CloudRain,
    "10n": CloudRain,
    "11d": CloudLightning,
    "11n": CloudLightning,
    "13d": CloudSnow,
    "13n": CloudSnow,
    "50d": CloudFog,
    "50n": CloudFog,
  };
  return iconMap[code] || Cloud;
};

export const FiveDayForecast = ({ forecast }: Props) => {
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    if (!forecast?.list || forecast.list.length === 0) return;

    // Get today's UTC date (year, month, day)
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Group forecast entries by UTC date (YYYY-MM-DD)
    const daysMap: {
      [utcDate: string]: {
        temps: number[];
        icon: string;
        dt: number; // first timestamp of that day
      };
    } = {};

    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const utcDateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!daysMap[utcDateStr]) {
        daysMap[utcDateStr] = {
          temps: [],
          icon: item.weather[0].icon,
          dt: item.dt,
        };
      }
      daysMap[utcDateStr].temps.push(item.main.temp);
    });

    // Sort UTC date strings
    const sortedUtcDates = Object.keys(daysMap).sort();

    // Build chart data for all days
    const chartData = sortedUtcDates.map((utcDateStr) => {
      const dayInfo = daysMap[utcDateStr];
      const temps = dayInfo.temps;
      const high = Math.round(Math.max(...temps));
      const low = Math.round(Math.min(...temps));
      const iconCode = dayInfo.icon;

      // Create Date object for this day (UTC)
      const [year, month, day] = utcDateStr.split('-').map(Number);
      const dayDate = new Date(Date.UTC(year, month - 1, day));

      // Calculate difference in days from today (UTC)
      const diffTime = dayDate.getTime() - todayUTC.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Determine label
      let label = "";
      if (diffDays === 0) label = "Today";
      else if (diffDays === -1) label = "Yesterday";
      else if (diffDays === 1) label = "Tomorrow";
      else {
        // Weekday abbreviation (e.g., "Mon", "Tue")
        label = dayDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      }

      // Display date as MM/DD
      const displayDate = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

      return {
        day: displayDate,
        label,
        high,
        low,
        iconCode,
      };
    });

    setData(chartData);
  }, [forecast]);

  if (!data.length) return null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.01 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      {/* Scrollable date row */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex justify-between items-center gap-4" style={{ minWidth: `${data.length * 80}px` }}>
          {data.map((item, idx) => {
            const Icon = getWeatherIcon(item.iconCode);
            return (
              <div key={idx} className="flex flex-col items-center text-center flex-1">
                <span className="text-sm text-gray-400">{item.day}</span>
                <span className="text-xs text-gray-300 mt-1">{item.label}</span>
                <Icon className="w-6 h-6 text-white/80 my-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" hide />
          <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value}°C`, undefined]}
            labelFormatter={() => ""}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#FF8C42"
            strokeWidth={3}
            dot={{ r: 5, fill: "#FF8C42", strokeWidth: 0 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#5096F1"
            strokeWidth={3}
            dot={{ r: 5, fill: "#5096F1", strokeWidth: 0 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#FF8C42]" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#5096F1]" />
          <span>Low</span>
        </div>
      </div>
    </motion.div>
  );
};