export default function PaddockNews({ lastRace, news = [] }) {
  // Extract podium from last race results
  const results = lastRace?.Results ?? [];
  const podium  = results.slice(0, 3);

  const raceName = lastRace?.raceName ?? 'Japanese Grand Prix';
  const circuit  = lastRace?.Circuit?.circuitName ?? 'Suzuka';

  const podColors   = ['p1','p2','p3'];
  const podLabels   = ['P1','P2','P3'];
  const podBgColors = ['#d4a017','#a0a0a0','#b06c30'];

  // Fallback podium if no API data
  const fallbackPodium = [
    { driver:'Kimi Antonelli', team:'Mercedes · #12', time:'1:28:14.802' },
    { driver:'George Russell',  team:'Mercedes · #63', time:'+3.441' },
    { driver:'Charles Leclerc', team:'Ferrari · #16',  time:'+9.127' },
  ];

  const displayPodium = podium.length >= 3
    ? podium.map((r, i) => ({
        driver: `${r.Driver?.givenName ?? ''} ${r.Driver?.familyName ?? ''}`.trim(),
        team:   `${r.Constructor?.name ?? ''} · #${r.Driver?.permanentNumber ?? ''}`,
        time:   i === 0 ? r.Time?.time ?? r.FastestLap?.Time?.time ?? '—' : `+${r.Time?.time ?? r.gap ?? '—'}`,
      }))
    : fallbackPodium;

  return (
    <div className="col">
      <div className="col-head">
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', letterSpacing:'.18em', marginBottom:'7px', fontWeight:500 }}>§ 03</div>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'24px', fontWeight:700, letterSpacing:'-0.015em', color:'var(--ink)', lineHeight:1 }}>
          Paddock <em style={{ fontStyle:'italic', color:'var(--racing)', fontWeight:500 }}>Intel</em>
        </div>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:'9px' }}>
          Last Race · Top Stories
        </div>
      </div>

      {/* Podium */}
      <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--rule-light)' }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:'14px', fontWeight:500 }}>
          {raceName} · {circuit} · Result
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {displayPodium.map((p, i) => (
            <div key={i} className={`pod-row ${podColors[i]}`}>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', fontWeight:700, textAlign:'center', padding:'6px 0', color:'#fff', letterSpacing:'.04em', background:podBgColors[i] }}>
                {podLabels[i]}
              </div>
              <div>
                <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'15px', fontWeight:500, color:'var(--ink)', letterSpacing:'-0.01em', lineHeight:1 }}>
                  {p.driver}
                </div>
                <div style={{ fontSize:'10px', color:'var(--ink-3)', marginTop:'3px' }}>
                  {p.team}
                </div>
              </div>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'var(--ink-2)', fontWeight:500 }}>
                {p.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News items */}
      <div className="news-block">
        {news.map((item, i) => (
          <article
            key={i}
            className={`news-item${item.lead ? ' lead' : ''}${item.neutral ? ' neutral' : ''}`}
          >
            <div className="news-meta flex items-center justify-between mb-[9px]">
              <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', letterSpacing:'.18em', textTransform:'uppercase', padding:'3px 7px', background: item.neutral ? 'var(--ink)' : 'var(--racing)', color:'#fff', fontWeight:600 }}>
                {item.kicker}
              </span>
              <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', fontWeight:500 }}>
                {String(i + 1).padStart(2,'0')}
              </span>
            </div>
            <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize: item.lead ? '17px' : '15px', fontWeight: item.lead ? 700 : 500, lineHeight:1.35, color:'var(--ink)', letterSpacing:'-0.01em', marginBottom:'7px' }}>
              {item.headline}
            </h3>
            <p style={{ fontSize:'12px', lineHeight:1.6, color:'var(--ink-2)' }}>
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
