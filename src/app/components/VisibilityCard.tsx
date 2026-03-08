import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";

interface Props {
  visibility: number; // in kilometers (from OpenWeather, already converted)
}

const getVisibilityStatus = (vis: number): string => {
  if (vis < 1) return "Fog";
  if (vis < 4) return "Poor";
  if (vis < 10) return "Moderate";
  if (vis < 20) return "Good";
  if (vis < 50) return "Very Good";
  return "Excellent";
};

export const VisibilityCard = ({ visibility }: Props) => {
  const [status, setStatus] = useState(getVisibilityStatus(visibility));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    setStatus(getVisibilityStatus(visibility));
  }, [visibility]);

  // V‑shape rows – bottom to top
  const vRows = [0, 1, 2, 3, 4];
  const maxSize = 24;
  const minSize = 8;

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
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-300">Visibility</span>
        {/* Custom eye icon with four dots below */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          {/* Four small dots below */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-1 h-1 bg-white/60 rounded-full" />
            <div className="w-1 h-1 bg-white/60 rounded-full" />
            <div className="w-1 h-1 bg-white/60 rounded-full" />
            <div className="w-1 h-1 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Central visualization */}
      <div className="relative h-28 w-full mb-6">
        {/* V‑shaped circles (left and right) */}
        {vRows.map((row, index) => {
          const fromBottom = index / (vRows.length - 1);
          const size = maxSize - (maxSize - minSize) * fromBottom;
          const opacity = 1 - fromBottom * 0.6;
          const leftOffset = 20 + fromBottom * 30;
          const rightOffset = 80 - fromBottom * 30;

          return (
            <div key={`row-${index}`}>
              {/* Left circle */}
              <motion.div
                className="absolute rounded-full bg-white/80"
                style={{
                  width: size,
                  height: size,
                  left: `${leftOffset}%`,
                  bottom: `${index * 20}%`,
                  opacity: isInView ? opacity : 0,
                }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
              />
              {/* Right circle */}
              <motion.div
                className="absolute rounded-full bg-white/80"
                style={{
                  width: size,
                  height: size,
                  right: `${100 - rightOffset}%`,
                  bottom: `${index * 20}%`,
                  opacity: isInView ? opacity : 0,
                }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: index * 0.1 + 0.05, type: "spring", stiffness: 50 }}
              />
            </div>
          );
        })}

        {/* Central column of four connected circles */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
          {[0, 1, 2, 3].map((idx) => (
            <div key={`col-${idx}`} className="flex flex-col items-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              />
              {idx < 3 && (
                <motion.div
                  className="w-0.5 h-3 bg-white/40"
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ delay: 0.35 + idx * 0.1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Value and status */}
      <div className="flex items-end gap-1">
        <motion.span
          key={visibility}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-white"
        >
          {visibility.toFixed(1)}
        </motion.span>
        <span className="text-sm text-gray-400 mb-1">km</span>
      </div>
      <motion.p
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-sm text-gray-300 mt-1"
      >
        {status}
      </motion.p>
    </motion.div>
  );
};