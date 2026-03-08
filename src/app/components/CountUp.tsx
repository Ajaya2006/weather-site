import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startCounting?: boolean;
  separator?: string;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1.5,
  className = "",
  startCounting = true,
  separator = ",",
}: CountUpProps) {

  const ref = useRef<HTMLSpanElement>(null);

  const motionValue = useMotionValue(direction === "down" ? to : from);

  const spring = useSpring(motionValue, {
    damping: 20,
    stiffness: 100,
  });

  const isInView = useInView(ref, { once: true });

  const formatValue = useCallback(
    (value: number) => {
      return Intl.NumberFormat("en-US", {
        useGrouping: true,
        maximumFractionDigits: 1,
      })
        .format(value)
        .replace(/,/g, separator);
    },
    [separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(from);
    }
  }, [from, formatValue]);

  useEffect(() => {
    if (isInView && startCounting) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, startCounting, delay, motionValue, direction, from, to]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [spring, formatValue]);

  return <span ref={ref} className={className} />;
}