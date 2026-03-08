import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { HeaderCard } from "./HeaderCard";
import { HourlyTrend } from "./HourlyTrend";
import { FiveDayForecast } from "./FiveDayForecast";
import { MetricsGrid } from "./MetricsGrid";
import { AirQualityCard } from "./AirQualityIndex";
import { SunMoonTracker } from "./SunMoonTracker";
import { LifestyleGrid } from "./LifestyleGrid";
import { WeatherBackground } from "./weatherBackground/WeatherBackground";
import { Footer } from "./Footer";

type PhaseType = "day" | "night" | "sunrise" | "sunset";

interface Props {
  data: any;
  loading: boolean;
  error: string;
  city: string;
  query: string;
  setQuery: (v: string) => void;
  searchCity: () => void;
  phase?: PhaseType;
}

export const WeatherInsightsDashboard = ({
  data,
  loading,
  error,
  city,
  query,
  setQuery,
  searchCity,
  phase,
}: Props) => {

  /* ---------------- LOADER ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">

        <motion.img
          src="/loader.png"
          alt="Loading"
          className="w-28 h-28 object-contain"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (!data || !data.current) return null;

  const current = data.current;
  const forecast = data.forecast;
  const condition = current.weather?.[0]?.main || "";

  const phaseValue: PhaseType = phase ?? "day";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="space-y-6 p-6"
    >

      {/* Background Section */}

      <div className="relative overflow-hidden rounded-3xl">

        {/* Weather Background */}

        <WeatherBackground
          condition={condition}
          sunrise={current.sys?.sunrise}
          sunset={current.sys?.sunset}
          phase={phaseValue}
        />

        {/* Content */}

        <div className="relative z-20 space-y-6 p-6">

          {/* Search Input */}

          <div className="relative max-w-md">

            <div
              className="
                relative
                flex
                items-center
                bg-white/20
                backdrop-blur-md
                border
                border-white/30
                rounded-full
                px-4
                py-2
              "
            >

              <Search className="w-5 h-5 text-white" />

              <input
                type="text"
                placeholder="Search location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCity()}
                className="
                  flex-1
                  ml-2
                  bg-transparent
                  outline-none
                  border-none
                  text-sm
                  text-white
                "
              />

            </div>

          </div>

          {/* Main Weather */}

          <HeaderCard data={current} city={city} transparent={true} />

          {/* Hourly Trend */}

          <HourlyTrend forecast={forecast} transparent={true} />

        </div>
      </div>

      {/* Forecast */}

      <FiveDayForecast forecast={forecast} />

      {/* Weather Metrics */}

      <MetricsGrid current={current} condition={condition} />

      {/* Air Quality */}

      {current.coord && (
        <AirQualityCard lat={current.coord.lat} lon={current.coord.lon} />
      )}

      {/* Sun & Moon Tracker */}

      <SunMoonTracker
        sunrise={current.sys?.sunrise}
        sunset={current.sys?.sunset}
        moonrise={forecast.daily?.[0]?.moonrise}
        moonset={forecast.daily?.[0]?.moonset}
      />

      {/* Lifestyle Insights */}

      <LifestyleGrid
        condition={condition}
        temp={current.main.temp}
        windSpeed={current.wind.speed}
        visibility={current.visibility / 1000}
      />

      {/* Footer */}

      <Footer />

    </motion.div>
  );
};