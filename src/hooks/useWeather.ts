import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export type Phase = "sunrise" | "sunset" | "day" | "night";

export const useWeather = () => {
  const [city, setCity] = useState("Detecting location...");
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("day");

  const detectPhase = (sunrise: number, sunset: number): Phase => {
    const now = Date.now() / 1000;

    if (now > sunrise - 1800 && now < sunrise + 1800) return "sunrise";
    if (now > sunset - 1800 && now < sunset + 1800) return "sunset";
    if (now >= sunrise && now <= sunset) return "day";
    return "night";
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 37.7749, lon: -122.4194 }); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setCoords({ lat: 37.7749, lon: -122.4194 })
    );
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    if (!API_KEY) {
      setError("Missing API key. Add VITE_WEATHER_API_KEY in .env");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [currentRes, forecastRes] = await Promise.all([
        axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: { lat, lon, units: "metric", appid: API_KEY },
        }),
        axios.get("https://api.openweathermap.org/data/2.5/forecast", {
          params: { lat, lon, units: "metric", appid: API_KEY },
        }),
      ]);

      const current = currentRes.data;

      setCity(current.name);

      setData({
        current,
        forecast: forecastRes.data,
      });

      setPhase(detectPhase(current.sys.sunrise, current.sys.sunset));

    } catch (err: any) {
      if (err.response?.status === 401) setError("Invalid API key");
      else if (err.response?.status === 404) setError("Location not found");
      else setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coords) fetchWeather(coords.lat, coords.lon);
  }, [coords, fetchWeather]);

  const searchCity = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: query, units: "metric", appid: API_KEY },
      });

      setCoords({ lat: res.data.coord.lat, lon: res.data.coord.lon });

    } catch (err: any) {
      if (err.response?.status === 404) setError("City not found");
      else if (err.response?.status === 401) setError("Invalid API key");
      else setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return { data, city, loading, error, query, setQuery, searchCity, phase };
};