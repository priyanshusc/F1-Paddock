import { getTeamColor, shortName } from '../lib/api';

export default function DriversStandings({ standings = [] }) {
  const top10 = standings.slice(0, 10);
  const leader = top10[0];

  return (
    <div className="col">
      <div className="col-head">
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', letterSpacing:'.18em', marginBottom:'7px', fontWeight:500 }}>§ 01</div>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'24px', fontWeight:700, letterSpacing:'-0.015em', color:'var(--ink)', lineHeight:1 }}>
          Drivers' <em style={{ fontStyle:'italic', color:'var(--racing)', fontWeight:500 }}>Championship</em>
        </div>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:'9px' }}>
          Top 10 · After {standings[0] ? (standings[0].wins !== undefined ? 'latest round' : '3 Rounds') : '3 Rounds'}
        </div>
      </div>

      {top10.map((entry, i) => {
        const d          = entry.Driver ?? {};
        const team       = (entry.Constructors ?? [])[0] ?? {};
        const teamColor  = getTeamColor(team.name ?? team.constructorId ?? '');
        const isLeader   = i === 0;
        const gap        = isLeader ? null : leader ? leader.points - entry.points : null;
        const name       = d.givenName && d.familyName
          ? `${d.givenName.charAt(0)}. ${d.familyName}`
          : d.familyName ?? 'Unknown';
        const code       = d.code ?? d.familyName?.slice(0,3).toUpperCase() ?? '???';
        const nat        = d.nationality ?? '';
        const teamName   = team.name ?? '';
        const delayMs    = 4500 + i * 80;

        const isDark = ['#27F4D2','#64C4FF'].includes(teamColor);

        return (
          <div
            key={d.driverId ?? i}
            className={`driver-row${isLeader ? ' leader' : ''}`}
            style={{
              '--team-color': teamColor,
              animationDelay: `${delayMs}ms`,
            }}
          >
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'13px', fontWeight:700, color:'var(--ink-2)', fontVariantNumeric:'tabular-nums' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="driver-info">
              <div className="driver-line flex items-center gap-2">
                <span style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', fontWeight:500, color:'var(--ink)', letterSpacing:'-0.01em' }}>
                  {name}
                </span>
                <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', fontWeight:700, color: isDark ? '#000' : '#fff', background:teamColor, padding:'3px 6px', letterSpacing:'.06em' }}>
                  {code}
                </span>
              </div>
              <div style={{ fontSize:'11px', color:'var(--ink-3)', marginTop:'2px', fontWeight:400 }}>
                {teamName}{nat ? ` · ${nat.toUpperCase().slice(0,3)}` : ''}
                {gap !== null && (
                  <span style={{ color:'var(--ink-2)', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:500 }}>
                    {' '}· <span style={{ color:'var(--ink-2)' }}>−{gap}</span>
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'20px', fontWeight:700, color:'var(--ink)', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>
                {entry.points ?? 0}
              </div>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', color:'var(--ink-3)', letterSpacing:'.12em', textTransform:'uppercase', marginTop:'3px' }}>
                pts
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
