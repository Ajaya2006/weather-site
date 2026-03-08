export const getWeatherGradient = (
  condition?: string,
  isDay: boolean = true,
  temp?: number
) => {
  const c = condition?.toLowerCase() || ""

  // Temperature intensity modifier
  const isHot = temp && temp > 35
  const isCold = temp && temp < 10

  // ☀️ CLEAR
  if (c.includes("clear")) {
    if (isDay) {
      if (isHot)
        return "from-yellow-200 via-orange-500 to-red-600"
      return "from-yellow-300 via-orange-400 to-sky-500"
    }
    return "from-slate-900 via-indigo-900 to-black"
  }

  // ☁️ CLOUDS
  if (c.includes("cloud")) {
    return isDay
      ? "from-gray-400 via-slate-600 to-gray-800"
      : "from-slate-800 via-gray-900 to-black"
  }

  // 🌧 RAIN / DRIZZLE
  if (c.includes("rain") || c.includes("drizzle")) {
    return "from-blue-600 via-indigo-800 to-slate-900"
  }

  // ⛈ THUNDERSTORM
  if (c.includes("thunder")) {
    return "from-gray-900 via-indigo-950 to-black"
  }

  // ❄️ SNOW
  if (c.includes("snow")) {
    return "from-blue-100 via-slate-200 to-white"
  }

  // 🌫 Mist / Fog
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) {
    return "from-gray-500 via-slate-600 to-gray-800"
  }

  // Default
  return isDay
    ? "from-indigo-500 via-purple-700 to-indigo-900"
    : "from-black via-slate-900 to-gray-950"
}