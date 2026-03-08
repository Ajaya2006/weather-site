import { motion } from "framer-motion";
import { FeelsLikeCard } from "./FeelsLikeCard";
import { WindCard } from "./WindCard";
import { HumidityCard } from "./HumidityCard";
import { UVIndexCard } from "./UVIndexCard";
import { VisibilityCard } from "./VisibilityCard";
import { PressureCard } from "./PressureCard";

interface Props {
  current: any;
  condition: string; // added
}

export const MetricsGrid = ({ current, condition }: Props) => {
  const uv = Math.floor(Math.random() * 10); // simulate UV (replace with real data if available)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-2 gap-4"
    >
      <FeelsLikeCard feelsLike={Math.round(current.main.feels_like)} />
      <WindCard
        speed={current.wind.speed}
        deg={current.wind.deg}
        condition={condition}
      />
      <HumidityCard humidity={current.main.humidity} />
      <UVIndexCard uv={uv} />
      <VisibilityCard visibility={current.visibility / 1000} />
      <PressureCard pressure={current.main.pressure} />
    </motion.div>
  );
};