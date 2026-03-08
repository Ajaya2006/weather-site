import { motion, useInView } from "framer-motion";
import { Thermometer } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Props {
  feelsLike: number;
}

const MIN_TEMP = -10;
const MAX_TEMP = 40;

const getComfortLabel = (temp: number): string => {
  if (temp < 0) return "Freezing";
  if (temp < 10) return "Cold";
  if (temp < 18) return "Cool";
  if (temp < 26) return "Comfortable";
  if (temp < 32) return "Warm";
  return "Hot";
};

export const FeelsLikeCard = ({ feelsLike }: Props) => {
  const [displayTemp, setDisplayTemp] = useState(feelsLike);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    setDisplayTemp(feelsLike);
  }, [feelsLike]);

  const clampedTemp = Math.min(MAX_TEMP, Math.max(MIN_TEMP, displayTemp));
  const percentage = ((clampedTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
  const label = getComfortLabel(feelsLike);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-300">Feels like:</span>
        <div className="relative">
          <Thermometer className="w-5 h-5 text-white" />
          <motion.div
            className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: isInView ? 1 : 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          />
        </div>
      </div>

      {/* Gradient slider */}
      <div className="relative w-full h-2 bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500 rounded-full mb-6">
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-200"
          style={{ translateY: "-50%" }}
          animate={{ left: `${isInView ? percentage : 0}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.2 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-white" />
          <motion.span
            key={displayTemp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            {Math.round(displayTemp)}°C
          </motion.span>
        </div>
      </div>

      <motion.div
        key={label}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-left text- 
        text-gray-300 mt-2"
      >
        {label}
      </motion.div>
    </motion.div>
  );
};