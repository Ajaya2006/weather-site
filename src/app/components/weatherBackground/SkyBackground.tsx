interface Props{
  sunrise:number
  sunset:number
}

export const SkyBackground = ({sunrise,sunset}:Props)=>{

  const now = Date.now()/1000

  const sunriseStart = sunrise - 1800
  const sunriseEnd = sunrise + 1800

  const sunsetStart = sunset - 1800
  const sunsetEnd = sunset + 1800


  // SUNRISE
  if(now >= sunriseStart && now <= sunriseEnd){

    return(
      <div className="absolute inset-0 -z-10
      bg-gradient-to-b
      from-red-500
      via-orange-400
      to-yellow-300"/>
    )

  }


  // SUNSET
  if(now >= sunsetStart && now <= sunsetEnd){

    return(
      <div className="absolute inset-0 -z-10
      bg-gradient-to-b
      from-red-600
      via-purple-700
      to-indigo-900"/>
    )

  }


  // DAY
  if(now > sunriseEnd && now < sunsetStart){

    return(
      <div className="absolute inset-0 -z-10
      bg-gradient-to-b
      from-sky-300
      via-sky-400
      to-blue-500"/>
    )

  }


  // NIGHT
  return(
    <div className="absolute inset-0 -z-10
    bg-gradient-to-b
    from-indigo-950
    via-indigo-900
    to-slate-900"/>
  )

}