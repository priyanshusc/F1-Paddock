'use client';
import { useEffect, useState } from 'react';
import { getFlagEmoji } from '../lib/api';

function pad(n) { return String(n).padStart(2, '0'); }

export default function RaceHero({ race }) {
  const [countdown, setCountdown] = useState({ d:'00', h:'00', m:'00', s:'00' });

  const raceName = race?.raceName ?? 'Miami Grand Prix';
  const circuit  = race?.Circuit?.circuitName ?? 'Miami International Autodrome';
  const locality = race?.Circuit?.Location?.locality ?? '';
  const country  = race?.Circuit?.Location?.country ?? 'USA';
  const date     = race?.date ?? '2026-05-03';
  const time     = race?.time ?? '20:00:00Z';
  const round    = race?.round ?? '4';
  const flag     = getFlagEmoji(country);

  // Build race datetime
  const raceDate = new Date(`${date}T${time}`);

  useEffect(() => {
    function tick() {
      const diff = raceDate.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ d:'00', h:'00', m:'00', s:'00' });
        return;
      }
      setCountdown({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [raceDate]);

  // Format display date range
  const d = new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayDate = `${months[d.getMonth()]} ${d.getDate()} – ${d.getDate() + 2}`;

  const gp = raceName.replace(' Grand Prix','');

  return (
    <div className="race-block">
      <div
        className="race-grid relative z-[1]"
        style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:'48px' }}
      >
        {/* Left */}
        <div className="race-left">
          <div className="flex items-center gap-[14px] mb-[18px]">
            <span className="race-round-badge">◆ Round {round} · Up Next</span>
            <span className="race-flag-big">{flag}</span>
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: 'clamp(44px, 6vw, 76px)',
              lineHeight: 0.92,
              letterSpacing: '-0.025em',
              color: '#fff',
            }}
          >
            {gp} <em style={{ fontStyle:'italic', color:'var(--racing-hot)', fontWeight:500 }}>Grand Prix</em>
          </h2>
          <div
            className="mb-[6px]"
            style={{ fontFamily:'Inter, sans-serif', fontSize:'14px', color:'rgba(255,255,255,0.68)' }}
          >
            <strong style={{ color:'#fff', fontWeight:500 }}>{circuit}</strong>
            {locality ? ` · ${locality}` : ''}
          </div>
          <div style={{ fontFamily:'Inter, sans-serif', fontSize:'14px', color:'rgba(255,255,255,0.68)' }}>
            Round {round} of 23 · 57 laps · 308.326 km
          </div>

          <div
            className="flex gap-9 mt-6 pt-[22px]"
            style={{ borderTop:'1px solid rgba(255,255,255,0.15)' }}
          >
            {[
              { label:'Lap Record', val:'1:29.708' },
              { label:'Pole 2025',  val:'M. Verstappen' },
              { label:'Dates',      val: displayDate },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:'7px' }}>
                  {s.label}
                </div>
                <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'15px', fontWeight:500, color:'#fff' }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Countdown */}
        <div className="race-right flex flex-col justify-center">
          <div
            className="countdown-label flex items-center gap-[10px] mb-5"
            style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', letterSpacing:'.26em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)' }}
          >
            Lights Out In
          </div>
          <div className="countdown" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            {[
              { id:'d', label:'Days',  val:countdown.d },
              { id:'h', label:'Hours', val:countdown.h },
              { id:'m', label:'Mins',  val:countdown.m },
              { id:'s', label:'Secs',  val:countdown.s },
            ].map(c => (
              <div
                key={c.id}
                className="cd-cell text-center"
                style={{ background:'var(--carbon-3)', padding:'20px 8px 16px', border:'1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="cd-num"
                  style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'clamp(36px,4.2vw,48px)', fontWeight:700, color:'#fff', lineHeight:1, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums' }}
                >
                  {c.val}
                </div>
                <div
                  style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginTop:'12px' }}
                >
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
