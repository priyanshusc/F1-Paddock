'use client';

export default function Ticker({ items = [] }) {
  // Fallback static items if API data isn't ready
  const defaultItems = [
    { sym: 'WDC',      val: 'ANTONELLI', pts: '72 pts' },
    { sym: 'WCC',      val: 'MERCEDES',  pts: '135 pts' },
    { sym: 'NEXT',     val: 'MIAMI GP',  pts: 'MAY 3' },
    { sym: 'WINNER',   val: 'ANTONELLI', pts: 'JAPAN' },
    { sym: 'FL',       val: 'RUSSELL',   pts: '1:28.411' },
    { sym: 'FAST PIT', val: 'MCLAREN',   pts: '1.94s' },
    { sym: 'VER',      val: '−60',       pts: 'P9' },
    { sym: 'ROOKIE',   val: 'LINDBLAD',  pts: '4 pts' },
  ];

  const displayItems = items.length ? items : defaultItems;

  const renderItem = (item, i) => (
    <>
      <span key={`item-${i}`} className="tick">
        <span className="sym">{item.sym}</span>{' '}
        <span className="val">{item.val}</span>{' '}
        <span className="pts">{item.pts}</span>
      </span>
      <span key={`dot-${i}`} className="tick tick-dot">◆</span>
    </>
  );

  return (
    <div className="ticker-wrap">
      <div className="ticker-track" id="tkTrack">
        {displayItems.map((item, i) => renderItem(item, i))}
        {/* Duplicate for seamless loop */}
        {displayItems.map((item, i) => renderItem(item, `dup-${i}`))}
      </div>
    </div>
  );
}
