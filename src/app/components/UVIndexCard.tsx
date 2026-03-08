import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Props {
  uv: number; // 0-11+ (real UV index)
}

const getUVLevel = (uv: number): { level: number; label: string } => {
  if (uv <= 2) return { level: 1, label: "Weakest" };
  if (uv <= 5) return { level: 2, label: "Moderate" };
  if (uv <= 7) return { level: 3, label: "High" };
  if (uv <= 10) return { level: 4, label: "Very High" };
  return { level: 5, label: "Extreme" };
};

export const UVIndexCard = ({ uv }: Props) => {
  const [level, setLevel] = useState(getUVLevel(uv));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    setLevel(getUVLevel(uv));
  }, [uv]);

  // Calculate indicator position (0% to 100%) – UV max considered 12
  const percentage = Math.min((uv / 12) * 100, 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden"
    >
      {/* Top row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-300">UV</span>
        {/* Icon: white circle with silhouette and two dots */}
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <div className="relative w-5 h-5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Gradient slider */}
      <div className="relative w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-purple-600 rounded-full mb-4">
        {/* White indicator – animates to current UV percentage */}
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-200"
          style={{ translateY: "-50%" }}
          animate={{
            left: isInView ? `${percentage}%` : "0%",
          }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 20,
            delay: isInView ? 0.2 : 0,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between items-end">
        <div>
          <motion.p
            key={level.level}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-gray-400"
          >
            Level {level.level}
          </motion.p>
          <motion.p
            key={level.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg font-bold text-white"
          >
            {level.label}
          </motion.p>
        </div>
        {/* Optional UV value */}
        <span className="text-xs text-gray-400">{uv} UV</span>
      </div>
    </motion.div>
  );
};