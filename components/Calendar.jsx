'use client';
import { useEffect, useRef } from 'react';
import { getFlagEmoji } from '../lib/api';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}`;
}

// Determine if a race is done vs next vs upcoming
function getRaceStatus(race, nextRace) {
  const today = new Date();
  const rd    = new Date(race.date ?? '');
  if (isNaN(rd.getTime())) return 'upcoming';
  if (race.round === nextRace?.round && race.season === nextRace?.season) return 'next';
  if (rd < today) return 'done';
  return 'upcoming';
}

// Static winner data keyed by round (fallback)
const STATIC_WINNERS = {
  '1': 'G. Russell',
  '2': 'K. Antonelli',
  '3': 'K. Antonelli',
};

export default function Calendar({ races = [], nextRace }) {
  const stripRef = useRef(null);

  // Auto-scroll to next race after mount
  useEffect(() => {
    const t = setTimeout(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const nextEl = strip.querySelector('.cal-round.next');
      if (nextEl) {
        strip.scrollTo({ left: nextEl.offsetLeft - 60, behavior: 'smooth' });
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Use static fallback calendar if API returns empty
  const staticRaces = [
    { round:'1',  raceName:'Australian Grand Prix',  Circuit:{ Location:{ country:'Australia', locality:'Melbourne' } },  date:'2026-03-08', winner:'G. Russell' },
    { round:'2',  raceName:'Chinese Grand Prix',     Circuit:{ Location:{ country:'China',     locality:'Shanghai'  } },  date:'2026-03-15', winner:'K. Antonelli' },
    { round:'3',  raceName:'Japanese Grand Prix',    Circuit:{ Location:{ country:'Japan',     locality:'Suzuka'    } },  date:'2026-03-29', winner:'K. Antonelli' },
    { round:'4',  raceName:'Miami Grand Prix',       Circuit:{ Location:{ country:'USA',       locality:'Miami'     } },  date:'2026-05-03' },
    { round:'5',  raceName:'Canadian Grand Prix',    Circuit:{ Location:{ country:'Canada',    locality:'Montreal'  } },  date:'2026-05-24' },
    { round:'6',  raceName:'Monaco Grand Prix',      Circuit:{ Location:{ country:'Monaco',    locality:'Monte Carlo'} }, date:'2026-06-07' },
    { round:'7',  raceName:'Spanish Grand Prix',     Circuit:{ Location:{ country:'Spain',     locality:'Barcelona' } },  date:'2026-06-14' },
    { round:'8',  raceName:'Austrian Grand Prix',    Circuit:{ Location:{ country:'Austria',   locality:'Spielberg' } },  date:'2026-06-28' },
    { round:'9',  raceName:'British Grand Prix',     Circuit:{ Location:{ country:'UK',        locality:'Silverstone'} }, date:'2026-07-05' },
    { round:'10', raceName:'Belgian Grand Prix',     Circuit:{ Location:{ country:'Belgium',   locality:'Spa'       } },  date:'2026-07-26' },
    { round:'11', raceName:'Hungarian Grand Prix',   Circuit:{ Location:{ country:'Hungary',   locality:'Budapest'  } },  date:'2026-08-02' },
    { round:'12', raceName:'Dutch Grand Prix',       Circuit:{ Location:{ country:'Netherlands',locality:'Zandvoort'} }, date:'2026-08-23' },
    { round:'13', raceName:'Italian Grand Prix',     Circuit:{ Location:{ country:'Italy',     locality:'Monza'     } },  date:'2026-09-06' },
    { round:'14', raceName:'Madrid Grand Prix',      Circuit:{ Location:{ country:'Spain',     locality:'Madrid'    } },  date:'2026-09-13' },
    { round:'15', raceName:'Azerbaijan Grand Prix',  Circuit:{ Location:{ country:'Azerbaijan',locality:'Baku'     } },  date:'2026-09-26' },
    { round:'16', raceName:'Singapore Grand Prix',   Circuit:{ Location:{ country:'Singapore', locality:'Singapore' } },  date:'2026-10-11' },
    { round:'17', raceName:'United States Grand Prix',Circuit:{ Location:{ country:'USA',     locality:'Austin'    } },  date:'2026-10-25' },
    { round:'18', raceName:'Mexico City Grand Prix', Circuit:{ Location:{ country:'Mexico',    locality:'Mexico City'} }, date:'2026-11-01' },
    { round:'19', raceName:'São Paulo Grand Prix',   Circuit:{ Location:{ country:'Brazil',    locality:'São Paulo' } },  date:'2026-11-08' },
    { round:'20', raceName:'Las Vegas Grand Prix',   Circuit:{ Location:{ country:'USA',       locality:'Las Vegas' } },  date:'2026-11-21' },
    { round:'21', raceName:'Qatar Grand Prix',       Circuit:{ Location:{ country:'Qatar',     locality:'Lusail'    } },  date:'2026-11-29' },
    { round:'22', raceName:'Abu Dhabi Grand Prix',   Circuit:{ Location:{ country:'Abu Dhabi', locality:'Yas Marina'} }, date:'2026-12-06' },
  ];

  const displayRaces = races.length ? races : staticRaces;
  const totalRounds  = displayRaces.length;
  const doneCount    = displayRaces.filter(r => getRaceStatus(r, nextRace) === 'done').length;
  const progress     = totalRounds > 0 ? (doneCount / totalRounds) * 100 : 13.6;

  return (
    <section className="cal-section" style={{ maxWidth:'1440px', margin:'0 auto', padding:'48px 36px 0' }}>
      <div className="flex items-baseline justify-between mb-5">
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'28px', fontWeight:500, letterSpacing:'-0.015em', color:'var(--ink)' }}>
          Season <em style={{ fontStyle:'italic', color:'var(--racing)', fontWeight:700 }}>Calendar</em>
        </div>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink-3)', fontWeight:500 }}>
          {totalRounds} Rounds · Mar → Dec 2026
        </div>
      </div>

      <div className="cal-strip-wrap">
        <div className="cal-progress-track">
          <div className="cal-progress-fill" style={{ width:`${progress}%` }} />
        </div>
        <div className="cal-strip" ref={stripRef}>
          {displayRaces.map((race, i) => {
            const status  = getRaceStatus(race, nextRace);
            const country = race.Circuit?.Location?.country ?? '';
            const flag    = getFlagEmoji(country);
            const name    = race.raceName?.replace(' Grand Prix','')?.replace(' City','')?.replace('São Paulo','São Paulo') ?? '';
            const winner  = race.winner ?? STATIC_WINNERS[race.round];
            const d       = new Date(race.date ?? '');
            const dateStr = !isNaN(d.getTime())
              ? `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}–${String(d.getDate()+2).padStart(2,'0')}`
              : '';

            return (
              <div
                key={race.round ?? i}
                className={`cal-round${status === 'done' ? ' done' : ''}${status === 'next' ? ' next' : ''}`}
              >
                <div className="cal-rnum">
                  R{String(race.round).padStart(2,'0')}{status === 'next' ? ' · NEXT' : ''}
                  {(status === 'done' || status === 'next') && <span className="cal-status-dot" />}
                </div>
                <div style={{ fontSize:'24px', lineHeight:1, marginBottom:'8px' }}>{flag}</div>
                <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:'4px', fontWeight:500 }}>
                  {country}
                </div>
                <div className="cal-flag-name">{name}</div>
                <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'var(--ink-2)', letterSpacing:'.04em', marginTop:'14px', fontWeight:500 }}>
                  {dateStr}
                </div>
                {status === 'done' && winner && (
                  <div className="cal-winner">{winner}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
