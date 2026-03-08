import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  pressure: number; // in hPa (from OpenWeather)
}

const MIN_PRESSURE = 950;
const MAX_PRESSURE = 1050;

export const PressureCard = ({ pressure }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const clamped = Math.min(MAX_PRESSURE, Math.max(MIN_PRESSURE, pressure));
  const percentage = (clamped - MIN_PRESSURE) / (MAX_PRESSURE - MIN_PRESSURE);
  const targetAngle = -90 + percentage * 180; // -90° (left) to 90° (right)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 relative overflow-hidden"
    >
      {/* Top row */}
      <div className="relative z-10 mb-1">
        <span className="text-xs text-gray-300">Pressure</span>
      </div>

      {/* Gauge container */}
      <div className="relative w-full flex justify-center">
        <div className="relative w-64 h-32">
          {/* Background track (semi‑circle) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 160">
            <path
              d="M 40 140 A 120 120 0 0 1 280 140"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Colored progress arc */}
            <defs>
              <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 40 140 A 120 120 0 0 1 280 140"
              fill="none"
              stroke="url(#pressureGradient)"
              strokeWidth="10"
              strokeDasharray="376.99 376.99"
              animate={{
                strokeDashoffset: isInView ? 376.99 * (1 - (targetAngle + 90) / 180) : 376.99,
              }}
              transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.2 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Needle container */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0 h-0">
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
              animate={{
                rotate: isInView ? targetAngle : -90,
              }}
              transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.3 }}
            >
              <svg width="6" height="110" className="block">
                <defs>
                  <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,1)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <polygon
                  points="3,0 0,110 6,110"
                  fill="url(#needleGradient)"
                  filter="url(#glow)"
                />
              </svg>
            </motion.div>
            <div className="absolute left-1/2 bottom-0 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] -translate-x-1/2 translate-y-1/2 z-20">
              <div className="absolute inset-0.5 bg-gradient-to-br from-white to-white/60 rounded-full" />
              <div className="absolute inset-1.5 bg-[#0f172a] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom left text */}
      <div className="absolute bottom-3 left-3 text-left">
        <div className="text-white/50 text-[10px] tracking-wider uppercase">Increase</div>
        <div className="flex items-end gap-1">
          <span className="text-white text-3xl font-light tracking-tight tabular-nums font-semibold">
            {Math.round(pressure)}
          </span>
          <span className="text-white/50 text-[10px] mb-1">hPa</span>
        </div>
      </div>
    </motion.div>
  );
};