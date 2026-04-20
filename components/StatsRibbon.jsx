export default function StatsRibbon({ drivers = [], constructors = [] }) {
  const leader  = drivers[0];
  const second  = drivers[1];
  const gap     = leader && second ? Number(leader.points) - Number(second.points) : 9;
  const leadName = leader?.Driver?.familyName ?? 'Antonelli';
  const p2Name   = second?.Driver?.familyName ?? 'Russell';
  const wccName  = constructors[0]?.Constructor?.name?.split('-')[0]?.split(' ')[0] ?? 'Mercedes';

  // Find Verstappen's position
  const verIdx = drivers.findIndex(d =>
    (d.Driver?.familyName ?? '').toLowerCase().includes('verstappen')
  );
  const verPos = verIdx >= 0 ? verIdx + 1 : 9;
  const verGap = leader && verIdx >= 0
    ? Number(leader.points) - Number(drivers[verIdx].points)
    : 60;

  const stats = [
    {
      label: 'Championship Lead',
      big:   `+${gap}`,
      bigEm: ' pts',
      sub:   `${leadName} over ${p2Name}`,
    },
    {
      label: 'Fastest Lap 2026',
      big:   '1:28.411',
      bigEm: '',
      sub:   `${p2Name} · Japan Q3`,
    },
    {
      label: 'Fastest Pit Stop',
      big:   '1.94',
      bigEm: 's',
      sub:   'McLaren · Japanese GP',
    },
    {
      label: 'Verstappen Gap',
      big:   `P${verPos}`,
      bigEm: ` · −${verGap}`,
      sub:   'Worst start since 2017',
    },
  ];

  return (
    <section className="stats-section" style={{ maxWidth:'1440px', margin:'0 auto', padding:'48px 36px 0' }}>
      <div
        className="stats-grid"
        style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', border:'2px solid var(--ink)', background:'var(--carbon)' }}
      >
        {stats.map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-label">{s.label}</div>
            <div
              className="stat-big"
              style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(28px,3vw,38px)', fontWeight:700, color:'#fff', lineHeight:1, letterSpacing:'-0.02em', marginBottom:'9px' }}
            >
              <em style={{ fontStyle:'italic', color:'var(--racing-hot)', fontWeight:500 }}>{s.big}</em>
              {s.bigEm}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
