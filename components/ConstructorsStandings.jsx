import { getTeamColor } from '../lib/api';

const ENGINE_MAP = {
  mercedes:      'Mercedes PU · DEU',
  ferrari:       'Ferrari PU · ITA',
  mclaren:       'Mercedes PU · GBR',
  red_bull:      'Red Bull Ford · AUT',
  'red bull':    'Red Bull Ford · AUT',
  alpine:        'Mercedes PU · FRA',
  haas:          'Ferrari PU · USA',
  williams:      'Mercedes PU · GBR',
  racing_bulls:  'Red Bull Ford · ITA',
  audi:          'Audi PU · DEU',
  aston_martin:  'Honda PU · GBR',
  cadillac:      'Ferrari PU · USA · NEW',
};

function getEngine(id = '') {
  const lower = id.toLowerCase().replace(/[\s-]/g, '_');
  return ENGINE_MAP[lower] ?? ENGINE_MAP[id] ?? 'PU · TBC';
}

export default function ConstructorsStandings({ standings = [] }) {
  const maxPts = standings[0] ? Number(standings[0].points) : 1;

  return (
    <div className="col">
      <div className="col-head">
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', letterSpacing:'.18em', marginBottom:'7px', fontWeight:500 }}>§ 02</div>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'24px', fontWeight:700, letterSpacing:'-0.015em', color:'var(--ink)', lineHeight:1 }}>
          Constructors' <em style={{ fontStyle:'italic', color:'var(--racing)', fontWeight:500 }}>Cup</em>
        </div>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:'9px' }}>
          All {standings.length || 11} teams · 2026
        </div>
      </div>

      {standings.map((entry, i) => {
        const c         = entry.Constructor ?? {};
        const teamColor = getTeamColor(c.constructorId ?? c.name ?? '');
        const pts       = Number(entry.points ?? 0);
        const barPct    = maxPts > 0 ? (pts / maxPts) * 100 : 0;
        const engine    = getEngine(c.constructorId ?? '');
        const delayMs   = 4500 + i * 80;
        const barDelay  = 5500 + i * 50;

        return (
          <div
            key={c.constructorId ?? i}
            className="con-row"
            style={{ '--team-color': teamColor, animationDelay:`${delayMs}ms` }}
          >
            <div style={{ display:'grid', gridTemplateColumns:'26px 1fr auto', alignItems:'center', gap:'12px', marginBottom:'9px' }}>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'12px', fontWeight:700, color:'var(--ink-2)', fontVariantNumeric:'tabular-nums' }}>
                {String(i + 1).padStart(2,'0')}
              </div>
              <div>
                <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'15px', fontWeight:500, color:'var(--ink)', letterSpacing:'-0.01em' }}>
                  {c.name ?? 'Unknown Team'}
                </div>
                <div style={{ fontSize:'10px', color:'var(--ink-3)', marginTop:'2px' }}>
                  {engine}
                </div>
              </div>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'18px', fontWeight:700, color:'var(--ink)', fontVariantNumeric:'tabular-nums' }}>
                {pts}
              </div>
            </div>
            <div className="con-bar">
              <div
                className="con-bar-fill"
                style={{ width:`${barPct}%`, animationDelay:`${barDelay}ms` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
