'use client';
import { useEffect, useState } from 'react';

const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export default function Hero() {
  const [greeting, setGreeting] = useState('Good morning, Priyanshu');
  const [dateline, setDateline] = useState('');

  useEffect(() => {
    const now = new Date();
    const h   = now.getHours();
    const g   = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(`${g}, Priyanshu`);
    setDateline(
      `${DAYS[now.getDay()]} · ${String(now.getDate()).padStart(2,'0')} ${MONTHS[now.getMonth()]} · ${now.getFullYear()}`
    );
  }, []);

  return (
    <section className="hero-section">
      {/* Speed lines */}
      <span className="speed-line" />
      <span className="speed-line" />
      <span className="speed-line" />

      {/* Top row */}
      <div className="hero-top flex justify-between items-start mb-7">
        <div className="brand-eyebrow">
          <span className="checker-flag" />
          <span>Personal Edition · F1 2026</span>
        </div>
        <div className="brand-right text-right">
          <div
            className="font-playfair italic text-[15px] text-ink-2 mb-1"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {greeting}
          </div>
          <div
            className="font-mono text-[10px] tracking-[.16em] uppercase text-ink-3"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {dateline}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="title-wrap relative mb-7 pb-6">
        <h1>
          <span className="hero-title-line1">
            <span>Priyanshu's</span>
          </span>
          <span className="hero-title-line2">
            <span>Pit Wall.</span>
          </span>
        </h1>
        <div className="title-underline" />
      </div>

      {/* Sub */}
      <div className="hero-sub">
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </div>
    </section>
  );
}
