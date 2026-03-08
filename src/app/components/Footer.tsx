import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
        mt-6
        text-center
        text-sm
        py-4
        border-t
        border-white/10
      "
      style={{ color: "white", }}
    >
      <p>
        Weather data powered by{" "}
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
          style={{ color: "var(--weather-text-color)" }}
        >
          OpenWeather
        </a>
      </p>

      <p className="mt-1">Designed & developed by Ajaya Kumar</p>
    </motion.footer>
  );
};