import { useMemo } from "react"

export const NightBackground = () => {

  const moonPhase = getMoonPhase()

  const stars = useMemo(() => {
    return new Array(3).fill(0).map((_, i) => ({
      id: i,
      top: Math.random() * 40,
      delay: Math.random() * 10,
      duration: Math.random() * 3 + 2
    }))
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden
    bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900">

      {/* Moon */}
      <div className="moon">
        <div
          className="moonShadow"
          style={{ transform: `translateX(${moonPhase * 30}px)` }}
        />
      </div>

      {/* Shooting Stars */}
      {stars.map(s => (
        <div
          key={s.id}
          className="shootingStar"
          style={{
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`
          }}
        />
      ))}

    </div>
  )
}


/* Moon Phase Calculation */
function getMoonPhase(){

  const now = new Date()

  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()

  let r = year % 100
  r %= 19
  if(r > 9) r -= 19

  r = ((r * 11) % 30) + month + day
  if(month < 3) r += 2

  const phase = (r < 0 ? r + 30 : r) / 30

  return phase
}