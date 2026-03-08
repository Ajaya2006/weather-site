import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { Sun, Moon } from "lucide-react";

interface Props {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
}

export const SunMoonTracker = ({ sunrise, sunset, moonrise, moonset }: Props) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const isInView = useInView(ref, { once: false, amount: 0.4 });

  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [sunPosition, setSunPosition] = useState({ x: 0, y: 0 });

  const [isDay, setIsDay] = useState(true);
  const [skyState, setSkyState] = useState("day");

  const formatTime = (t: number) =>
    new Date(t * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  const sunriseStr = formatTime(sunrise);
  const sunsetStr = formatTime(sunset);
  const moonriseStr = formatTime(moonrise);
  const moonsetStr = formatTime(moonset);

  const moonPhases = [
    "New Moon","Waxing Crescent","First Quarter","Waxing Gibbous",
    "Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"
  ];

  const moonPhaseName =
    moonPhases[Math.floor((Date.now() / 86400000) % 8)];

  /* ---------- Stars ---------- */

  const stars = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60,
      delay: Math.random() * 5,
      size: Math.random() * 2 + 1
    })), []);

  /* ---------- Time Calculation ---------- */

  useEffect(() => {

    const updateTime = () => {

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const sunriseDate = new Date(sunrise * 1000);
      const sunsetDate = new Date(sunset * 1000);

      const riseMinutes =
        sunriseDate.getHours() * 60 + sunriseDate.getMinutes();

      const setMinutes =
        sunsetDate.getHours() * 60 + sunsetDate.getMinutes();

      const day =
        currentMinutes >= riseMinutes &&
        currentMinutes < setMinutes;

      setIsDay(day);

      const sunriseWindow = riseMinutes + 30;
      const sunsetWindow = setMinutes - 30;

      if (currentMinutes < riseMinutes) setSkyState("night");
      else if (currentMinutes < sunriseWindow) setSkyState("sunrise");
      else if (currentMinutes < sunsetWindow) setSkyState("day");
      else if (currentMinutes < setMinutes) setSkyState("sunset");
      else setSkyState("night");

      let p = 0;

      if (day) {

        p =
          (currentMinutes - riseMinutes) /
          (setMinutes - riseMinutes);

      } else {

        const nightDuration =
          24 * 60 - setMinutes + riseMinutes;

        const nightMinutes =
          currentMinutes < riseMinutes
            ? currentMinutes + (24 * 60 - setMinutes)
            : currentMinutes - setMinutes;

        p = nightMinutes / nightDuration;
      }

      setProgress(Math.min(Math.max(p, 0), 1));

    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);

  }, [sunrise, sunset]);

  /* ---------- Reset animation when section enters ---------- */

  useEffect(() => {
    if (isInView) {
      setAnimatedProgress(0);
    }
  }, [isInView]);

  /* ---------- Animate sun/moon ---------- */

  useEffect(() => {

    if (!isInView) return;

    const start = 0;
    const end = progress;

    const duration = 1400;
    const startTime = performance.now();

    const animate = (time: number) => {

      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - t, 3);

      const value = start + (end - start) * eased;

      setAnimatedProgress(value);

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

  }, [progress, isInView]);

  /* ---------- Calculate position on path ---------- */

  useEffect(() => {

    if (!pathRef.current) return;

    const path = pathRef.current;

    const length = path.getTotalLength();
    const point = path.getPointAtLength(length * animatedProgress);

    setSunPosition({
      x: point.x,
      y: point.y
    });

  }, [animatedProgress]);

  /* ---------- Clouds ---------- */

  const clouds = [
    { id:1,left:"10%",top:"20%",width:120,height:50,delay:0 },
    { id:2,left:"60%",top:"18%",width:160,height:60,delay:2 },
    { id:3,left:"30%",top:"65%",width:140,height:50,delay:1 },
    { id:4,left:"80%",top:"50%",width:120,height:45,delay:3 }
  ];

  const skyGradient = {
    sunrise:"from-orange-400 via-pink-400 to-blue-400",
    day:"from-sky-400 to-blue-600",
    sunset:"from-orange-500 via-pink-500 to-purple-600",
    night:"from-slate-900 via-indigo-950 to-black"
  }[skyState];

  return (

<motion.div
ref={ref}
initial={{opacity:0,y:40}}
animate={{opacity:isInView?1:0.7,y:0}}
transition={{duration:0.6}}
className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${skyGradient}`}
>

{/* ---------- Stars ---------- */}

{skyState==="night" && (

<div className="absolute inset-0 z-0">

{stars.map(star => (

<motion.div
key={star.id}
className="absolute bg-white rounded-full"
style={{
left:`${star.left}%`,
top:`${star.top}%`,
width:star.size,
height:star.size
}}
animate={{
opacity:[0.2,1,0.2],
scale:[0.8,1.3,0.8]
}}
transition={{
delay:star.delay,
duration:3,
repeat:Infinity,
ease:"easeInOut"
}}
/>

))}

</div>

)}

{/* ---------- Clouds ---------- */}

{isDay && (

<div className="absolute inset-0 overflow-hidden z-0">

{clouds.map(cloud => (

<motion.div
key={cloud.id}
className="absolute bg-white/60 rounded-full blur-3xl"
style={{
left:cloud.left,
top:cloud.top,
width:cloud.width,
height:cloud.height
}}
animate={{
x:[0,60,0],
opacity:[0.5,0.9,0.5]
}}
transition={{
duration:25 + cloud.delay*3,
repeat:Infinity
}}
/>

))}

</div>

)}

{/* ---------- Header ---------- */}

<div className="flex justify-between mb-6 relative z-10">

<span className="text-xs uppercase tracking-widest opacity-70 font-extrabold">
Sun & Moon
</span>

<span className="text-sm">
{new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})}
</span>

</div>

{/* ---------- Orbit ---------- */}

<div className="relative w-[85%] mx-auto h-64 z-10">

<svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">

<path
ref={pathRef}
d="M 0 35 C 20 35, 30 5, 50 5 C 70 5, 80 35, 100 35"
fill="none"
stroke="white"
strokeOpacity="0.35"
strokeWidth="1.5"
/>

<g transform={`translate(${sunPosition.x},${sunPosition.y})`}>

{isDay ? (

<>
<circle r="6" fill="#fbbf24" opacity="0.25"/>
<circle r="4" fill="#fbbf24" opacity="0.4"/>
<circle r="2" fill="#fcd34d"/>
<g transform="translate(-4,-4)">
<Sun size={8} color="#f59e0b" strokeWidth={2.5} fill="#fbbf24"/>
</g>
</>

) : (

<>
<circle r="6" fill="#cbd5f5" opacity="0.25"/>
<circle r="4" fill="#cbd5f5" opacity="0.4"/>
<circle r="2" fill="#e2e8f0"/>
<g transform="translate(-4,-4)">
<Moon size={8} color="#e2e8f0" strokeWidth={2.5} fill="#cbd5f5"/>
</g>
</>

)}

</g>

</svg>

</div>

{/* ---------- Info Panel ---------- */}

<div className="relative z-20 -mt-28 pt-32 pb-8 px-6 bg-black/30 backdrop-blur-md rounded-xl">

<div className="grid grid-cols-3 gap-6 text-center">

<div>
<p className="text-xs opacity-50 uppercase">Sunrise</p>
<p className="text-sm">{sunriseStr}</p>
</div>

<div>
<p className="text-xs opacity-50 uppercase">Sunset</p>
<p className="text-sm">{sunsetStr}</p>
</div>

<div>
<p className="text-xs opacity-50 uppercase">Moon Phase</p>
<p className="text-sm">{moonPhaseName}</p>
</div>

<div>
<p className="text-xs opacity-50 uppercase">Moonrise</p>
<p className="text-sm">{moonriseStr}</p>
</div>

<div>
<p className="text-xs opacity-50 uppercase">Moonset</p>
<p className="text-sm">{moonsetStr}</p>
</div>

</div>

</div>

</motion.div>

  );
};