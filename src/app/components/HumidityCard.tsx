import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

interface Props {
  humidity: number;
}

export const HumidityCard = ({ humidity }: Props) => {
  const getLabel = (h: number) => {
    if (h < 30) return "Dry";
    if (h < 50) return "Comfortable";
    if (h < 70) return "Moderate";
    return "Humid";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-center gap-1 mb-2">
        <Droplets className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm text-gray-400">Humidity</h4>
      </div>
      <p className="text-3xl font-bold text-white">{humidity}%</p>
      <p className="text-xs text-blue-300 mt-1">{getLabel(humidity)}</p>
    </motion.div>
  );
};