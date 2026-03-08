import { useEffect, useState } from "react";

interface WeatherVideoBackgroundProps {
  condition?: string;
  sunrise?: number;
  sunset?: number;
  darkOverlay?: boolean;
}

const videos = {
  clear: "/videos/clear.mp4",
  night: "/videos/night.mp4",
  rain: "/videos/rain.mp4",
  clouds: "/videos/clouds.mp4",
  storm: "/videos/storm.mp4",
  snow: "/videos/snow.mp4",
  fallback: "/images/weather-fallback.jpg",
};

const isNightTime = (sunrise?: number, sunset?: number) => {
  if (!sunrise || !sunset) {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  }

  const now = Date.now();
  return now < sunrise * 1000 || now > sunset * 1000;
};

export const WeatherVideoBackground = ({
  condition = "",
  sunrise,
  sunset,
  darkOverlay = false,
}: WeatherVideoBackgroundProps) => {
  const [video, setVideo] = useState(videos.clear);
  const [loaded, setLoaded] = useState(false);
  const [useImage, setUseImage] = useState(false);

  useEffect(() => {
    let selectedVideo = isNightTime(sunrise, sunset) ? videos.night : videos.clear;

    if (condition) {
      const c = condition.toLowerCase();

      if (c.includes("thunder") || c.includes("storm")) {
        selectedVideo = videos.storm;
      } else if (c.includes("rain")) {
        selectedVideo = videos.rain;
      } else if (c.includes("snow")) {
        selectedVideo = videos.snow;
      } else if (c.includes("cloud")) {
        selectedVideo = videos.clouds;
      } else {
        selectedVideo = isNightTime(sunrise, sunset) ? videos.night : videos.clear;
      }
    }

    setVideo(selectedVideo);
    setLoaded(false);
    setUseImage(false);

    // CSS variables for theme based on day/night
    const isNight = selectedVideo === videos.night || isNightTime(sunrise, sunset);

    document.documentElement.style.setProperty(
      "--weather-text-color",
      isNight ? "#ffffff" : "#111111"
    );

    document.documentElement.style.setProperty(
      "--weather-chart-bg",
      isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
    );

    document.documentElement.style.setProperty(
      "--weather-chart-grid",
      isNight ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"
    );
  }, [condition, sunrise, sunset]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {!useImage && (
        <video
          key={video}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-50" : "opacity-0"
          }`}
          onCanPlay={() => setLoaded(true)}
          onError={() => setUseImage(true)}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {useImage && (
        <img
          src={videos.fallback}
          alt="Weather background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      )}

      {/* Visibility overlay */}
      <div
        className={`absolute inset-0 ${
          darkOverlay ? "bg-black/50" : "bg-black/35"
        } backdrop-blur-[1px]`}
      />

      {/* Bottom gradient for text clarity */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
};