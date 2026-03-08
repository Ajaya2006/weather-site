import { motion } from "framer-motion";
import { Bike, Eye, Fish, Sailboat, Snowflake, Bug } from "lucide-react";

interface Props {
  condition: string;
  temp: number;
  windSpeed: number;
  visibility: number;
}

export const LifestyleGrid = ({ condition, temp, windSpeed, visibility }: Props) => {
  const activities = [
    {
      icon: Bike,
      label: "Outdoor activities",
      status:
        temp > 18 && windSpeed < 6
          ? "Great for outdoor fun"
          : "Not ideal for outdoor activities",
      color: "text-green-500",
    },
    {
      icon: Eye,
      label: "Stargazing",
      status:
        condition.toLowerCase().includes("clear") && visibility > 10
          ? "Excellent visibility"
          : "Poor visibility",
      color: "text-yellow-500",
    },
    {
      icon: Fish,
      label: "Fishing",
      status: windSpeed < 5 ? "Calm waters" : "Choppy waters",
      color: "text-blue-500",
    },
    {
      icon: Sailboat,
      label: "Sailing",
      status: windSpeed >= 4 && windSpeed <= 10 ? "Ideal sailing conditions" : "Not recommended",
      color: "text-cyan-500",
    },
    {
      icon: Snowflake,
      label: "Cold feeling",
      status:
        temp < 5
          ? "Very cold"
          : temp < 15
          ? "Chilly"
          : "Mild and comfortable",
      color: "text-blue-400",
    },
    {
      icon: Bug,
      label: "Mosquito activity",
      status:
        temp >= 18 && temp <= 30
          ? "High mosquito activity"
          : "Low mosquito activity",
      color: "text-purple-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">Lifestyle Insights</h3>

      <div className="grid grid-cols-2 gap-4">
        {activities.map((item, idx) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.04 }}
              className="bg-white/10 p-4 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
              <p className={`text-sm font-semibold ${item.color}`}>{item.status}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};