import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface Props {
  data: any;
  city: string;
  transparent?: boolean;
}

export const HeaderCard = ({ data, city }: Props) => {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const condition = data.weather?.[0]?.main || "Clear";
  const icon = data.weather?.[0]?.icon;

  // Determine if it's day or night from OpenWeather icon
  const isDay = icon?.includes("d") ?? true;

  // Adaptive text color for day/night
  const textColor = isDay ? "#1f2937" : "#f0f0f0"; // dark text for day, light text for night
  const iconColor = isDay ? "#f59e0b" : "#9ca3af"; // Sun Amber for day, Moon Gray for night

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="relative rounded-3xl p-6 overflow-hidden bg-transparent border-0"
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: textColor }}>
            {city}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            {isDay ? (
              <Sun className="w-6 h-6" style={{ color: iconColor }} />
            ) : (
              <Moon className="w-6 h-6" style={{ color: iconColor }} />
            )}

            <p className="capitalize text-lg" style={{ color: textColor }}>
              {condition}
            </p>
          </div>
        </div>

        <div className="text-right">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-8xl font-extrabold"
            style={{ color: textColor }}
          >
            {temp}°
          </motion.div>

          <p className="text-base" style={{ color: textColor }}>
            Feels like {feelsLike}°
          </p>
        </div>
      </div>

      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={condition}
          className="absolute bottom-0 right-0 w-28 h-28 opacity-30"
        />
      )}
    </motion.div>
  );
};