import { motion } from "framer-motion";
import { useWeather } from "../hooks/useWeather";
import { WeatherInsightsDashboard } from "./components/WeatherInsightsDashboard";

// Map weather conditions to dark background colors (gradients)
const getBackgroundColor = (condition: string): string => {
  const c = condition.toLowerCase();

  if (c.includes("thunder") || c.includes("storm")) {
    return "bg-gradient-to-br from-gray-900 to-purple-950";
  }
  if (c.includes("rain")) {
    return "bg-gradient-to-br from-blue-950 to-indigo-950";
  }
  if (c.includes("snow")) {
    return "bg-gradient-to-br from-slate-800 to-blue-900";
  }
  if (c.includes("cloud")) {
    return "bg-gradient-to-br from-gray-800 to-slate-900";
  }

  // default / clear sky
  return "bg-gradient-to-br from-cyan-900 to-blue-950";
};

export default function App() {
  // Hook (only once)
  const { data, loading, error, city, query, setQuery, searchCity, phase } =
    useWeather();

  const condition = data?.current?.weather?.[0]?.main || "clear";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Dynamic background */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${getBackgroundColor(
          condition
        )}`}
      />

      <div className="relative z-10">
        <WeatherInsightsDashboard
          data={data}
          loading={loading}
          error={error}
          city={city}
          query={query}
          setQuery={setQuery}
          searchCity={searchCity}
          phase={phase}
        />
      </div>
    </motion.div>
  );
}