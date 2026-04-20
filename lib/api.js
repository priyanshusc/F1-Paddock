// ─── API Base URLs ───
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1  = 'https://api.openf1.org/v1';

const REVALIDATE = 60; // seconds

// ─── Team color map ───
export const TEAM_COLORS = {
  mercedes:      '#27F4D2',
  ferrari:       '#E8002D',
  mclaren:       '#FF8000',
  'red bull':    '#3671C6',
  'red_bull':    '#3671C6',
  williams:      '#64C4FF',
  haas:          '#B6BABD',
  alpine:        '#0093CC',
  audi:          '#00877C',
  'racing bulls':'#6692FF',
  'racing_bulls':'#6692FF',
  'rb f1':       '#6692FF',
  'aston martin':'#229971',
  cadillac:      '#8A9099',
};

export function getTeamColor(teamName = '') {
  const lower = teamName.toLowerCase();
  for (const [key, val] of Object.entries(TEAM_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return '#8a8172';
}

// ─── Format driver name as "F. Lastname" ───
export function shortName(givenName = '', familyName = '') {
  return `${givenName.charAt(0)}. ${familyName}`;
}

// ─── Calendar / Season schedule ───
export async function getCalendar(season = '2026') {
  try {
    const res = await fetch(`${JOLPICA}/${season}.json`, {
      next: { revalidate: REVALIDATE * 60 },
    });
    if (!res.ok) throw new Error('calendar fetch failed');
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races ?? [];
  } catch {
    return [];
  }
}

// ─── Driver standings ───
export async function getDriverStandings(season = '2026') {
  try {
    const res = await fetch(`${JOLPICA}/${season}/driverStandings.json`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error('driver standings fetch failed');
    const data = await res.json();
    const lists = data?.MRData?.StandingsTable?.StandingsLists ?? [];
    return lists[0]?.DriverStandings ?? [];
  } catch {
    return [];
  }
}

// ─── Constructor standings ───
export async function getConstructorStandings(season = '2026') {
  try {
    const res = await fetch(`${JOLPICA}/${season}/constructorStandings.json`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error('constructor standings fetch failed');
    const data = await res.json();
    const lists = data?.MRData?.StandingsTable?.StandingsLists ?? [];
    return lists[0]?.ConstructorStandings ?? [];
  } catch {
    return [];
  }
}

// ─── Next race ───
export async function getNextRace() {
  try {
    const res = await fetch(`${JOLPICA}/current/next.json`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error('next race fetch failed');
    const data = await res.json();
    const races = data?.MRData?.RaceTable?.Races ?? [];
    return races[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Last race results (podium) ───
export async function getLastRaceResults(season = '2026') {
  try {
    // Get current standings to find last completed round
    const standRes = await fetch(`${JOLPICA}/${season}/driverStandings.json`, {
      next: { revalidate: REVALIDATE },
    });
    if (!standRes.ok) throw new Error();
    const standData = await standRes.json();
    const lists = standData?.MRData?.StandingsTable?.StandingsLists ?? [];
    const lastRound = lists[0]?.round;
    if (!lastRound) return null;

    const res = await fetch(`${JOLPICA}/${season}/${lastRound}/results.json`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error('results fetch failed');
    const data = await res.json();
    const races = data?.MRData?.RaceTable?.Races ?? [];
    return races[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Fastest lap (OpenF1) ───
export async function getFastestLap(sessionKey = 'latest') {
  try {
    const res = await fetch(`${OPENF1}/laps?session_key=${sessionKey}&is_pit_out_lap=false`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    const valid = data.filter(l => l.lap_duration && l.lap_duration > 0);
    if (!valid.length) return null;
    valid.sort((a, b) => a.lap_duration - b.lap_duration);
    return valid[0];
  } catch {
    return null;
  }
}

// ─── Pit stop data (OpenF1) ───
export async function getFastestPit(sessionKey = 'latest') {
  try {
    const res = await fetch(`${OPENF1}/pit?session_key=${sessionKey}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    const valid = data.filter(p => p.pit_duration && p.pit_duration > 0);
    if (!valid.length) return null;
    valid.sort((a, b) => a.pit_duration - b.pit_duration);
    return valid[0];
  } catch {
    return null;
  }
}

// ─── Flag emoji helper ───
export function getFlagEmoji(countryCode = '') {
  const map = {
    'Australia':   '🇦🇺', 'China':       '🇨🇳', 'Japan':        '🇯🇵',
    'USA':         '🇺🇸', 'United States':'🇺🇸', 'Canada':       '🇨🇦',
    'Monaco':      '🇲🇨', 'Spain':        '🇪🇸', 'Austria':      '🇦🇹',
    'UK':          '🇬🇧', 'Great Britain':'🇬🇧', 'Belgium':      '🇧🇪',
    'Hungary':     '🇭🇺', 'Netherlands':  '🇳🇱', 'Italy':        '🇮🇹',
    'Azerbaijan':  '🇦🇿', 'Singapore':    '🇸🇬', 'Mexico':       '🇲🇽',
    'Brazil':      '🇧🇷', 'Qatar':        '🇶🇦', 'Abu Dhabi':    '🇦🇪',
    'Saudi Arabia':'🇸🇦', 'Bahrain':      '🇧🇭',
  };
  return map[countryCode] || '🏁';
}

// ─── Format lap time from seconds ───
export function formatLapTime(seconds) {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}

// ─── Static fallback data (used if API is down) ───
export const FALLBACK_DRIVERS = [
  { position:'1', Driver:{ givenName:'K.', familyName:'Antonelli', nationality:'Italian', code:'ANT' }, Constructors:[{ name:'Mercedes', constructorId:'mercedes' }], points:'72' },
  { position:'2', Driver:{ givenName:'G.', familyName:'Russell',   nationality:'British', code:'RUS' }, Constructors:[{ name:'Mercedes', constructorId:'mercedes' }], points:'63' },
  { position:'3', Driver:{ givenName:'C.', familyName:'Leclerc',   nationality:'Monégasque', code:'LEC' }, Constructors:[{ name:'Ferrari',  constructorId:'ferrari'  }], points:'49' },
  { position:'4', Driver:{ givenName:'L.', familyName:'Hamilton',  nationality:'British', code:'HAM' }, Constructors:[{ name:'Ferrari',  constructorId:'ferrari'  }], points:'41' },
  { position:'5', Driver:{ givenName:'L.', familyName:'Norris',    nationality:'British', code:'NOR' }, Constructors:[{ name:'McLaren',  constructorId:'mclaren'  }], points:'25' },
  { position:'6', Driver:{ givenName:'O.', familyName:'Piastri',   nationality:'Australian', code:'PIA' }, Constructors:[{ name:'McLaren', constructorId:'mclaren'  }], points:'21' },
  { position:'7', Driver:{ givenName:'O.', familyName:'Bearman',   nationality:'British', code:'BEA' }, Constructors:[{ name:'Haas F1 Team', constructorId:'haas'  }], points:'17' },
  { position:'8', Driver:{ givenName:'P.', familyName:'Gasly',     nationality:'French', code:'GAS'  }, Constructors:[{ name:'Alpine',  constructorId:'alpine'   }], points:'15' },
  { position:'9', Driver:{ givenName:'M.', familyName:'Verstappen',nationality:'Dutch',  code:'VER'  }, Constructors:[{ name:'Red Bull Racing', constructorId:'red_bull' }], points:'12' },
  { position:'10',Driver:{ givenName:'L.', familyName:'Lawson',    nationality:'New Zealander', code:'LAW' }, Constructors:[{ name:'RB F1 Team', constructorId:'racing_bulls' }], points:'10' },
];

export const FALLBACK_CONSTRUCTORS = [
  { position:'1',  Constructor:{ name:'Mercedes-AMG Petronas',  constructorId:'mercedes'     }, points:'135' },
  { position:'2',  Constructor:{ name:'Scuderia Ferrari',        constructorId:'ferrari'      }, points:'90'  },
  { position:'3',  Constructor:{ name:'McLaren F1 Team',         constructorId:'mclaren'      }, points:'46'  },
  { position:'4',  Constructor:{ name:'Haas F1 Team',            constructorId:'haas'         }, points:'18'  },
  { position:'5',  Constructor:{ name:'Red Bull Racing',         constructorId:'red_bull'     }, points:'16'  },
  { position:'6',  Constructor:{ name:'Alpine F1 Team',          constructorId:'alpine'       }, points:'16'  },
  { position:'7',  Constructor:{ name:'Racing Bulls',            constructorId:'racing_bulls' }, points:'14'  },
  { position:'8',  Constructor:{ name:'Audi F1 Team',            constructorId:'audi'         }, points:'2'   },
  { position:'9',  Constructor:{ name:'Williams Racing',         constructorId:'williams'     }, points:'2'   },
  { position:'10', Constructor:{ name:'Aston Martin',            constructorId:'aston_martin' }, points:'0'   },
  { position:'11', Constructor:{ name:'Cadillac F1 Team',        constructorId:'cadillac'     }, points:'0'   },
];

export const FALLBACK_NEXT_RACE = {
  raceName: 'Miami Grand Prix',
  Circuit: { circuitName: 'Miami International Autodrome', Location: { country: 'USA', locality: 'Miami' } },
  date: '2026-05-03',
  time: '20:00:00Z',
  round: '4',
  season: '2026',
};

export const STATIC_NEWS = [
  {
    kicker: 'The Story',
    headline: "Antonelli's rookie surge rewrites Mercedes' championship math",
    body: "Three rounds in, the 19-year-old Italian has back-to-back wins and sits atop the drivers' table. Wolff has already shifted team orders mid-weekend. Russell now races his own teammate for the title.",
    lead: true,
    neutral: false,
  },
  {
    kicker: 'Engine Wars',
    headline: "Red Bull's new PU is down 15hp to Mercedes, paddock sources say",
    body: "Despite the full Ford works programme, Red Bull's 2026 power unit appears weakest on the grid. Verstappen's P5 in Japan came from chassis, not pace.",
    lead: false,
    neutral: true,
  },
  {
    kicker: 'Debut',
    headline: 'Cadillac goal is simple: finish races, learn fast, build for 2029',
    body: "GM's eleventh team runs Ferrari PUs until its in-house unit is ready. Herta confirmed for four FP1 outings this year.",
    lead: false,
    neutral: true,
  },
  {
    kicker: 'Calendar',
    headline: 'FIA confirms Bahrain and Saudi cancellations, no replacements',
    body: 'Iran war fallout leaves the season at 23 rounds, Australia to Abu Dhabi. Feeder series affected too.',
    lead: false,
    neutral: false,
  },
];
