import { useEffect, useState } from 'react';

// Live clock for another time zone, e.g. "11:35 pm". Uses Intl, so it shows the time in that
// zone no matter where the visitor is. It ticks on the minute, and catches up when the tab
// becomes visible again (browsers throttle timers in background tabs).
export default function useLocalTime({ locale, timeZone }) {
  const [time, setTime] = useState(() => format(new Date(), locale, timeZone));

  useEffect(() => {
    const update = () => setTime(format(new Date(), locale, timeZone));
    const untilNextMinute = () => 60000 - (Date.now() % 60000) + 50;
    let timer;
    const tick = () => {
      update();
      timer = setTimeout(tick, untilNextMinute());
    };
    timer = setTimeout(tick, untilNextMinute());
    const onVisible = () => {
      if (!document.hidden) update();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [locale, timeZone]);

  return time;
}

function format(date, locale, timeZone) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  })
    .format(date)
    .replace(/\s+/g, ' ') // newer ICU uses a narrow no-break space before AM/PM
    .toLowerCase();
}
