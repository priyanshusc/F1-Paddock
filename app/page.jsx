import {
  getCalendar,
  getDriverStandings,
  getConstructorStandings,
  getNextRace,
  getLastRaceResults,
  FALLBACK_DRIVERS,
  FALLBACK_CONSTRUCTORS,
  FALLBACK_NEXT_RACE,
  STATIC_NEWS,
} from '../lib/api';

import Ticker                from '../components/Ticker';
import Hero                  from '../components/Hero';
import RaceHero              from '../components/RaceHero';
import Calendar              from '../components/Calendar';
import DriversStandings      from '../components/DriversStandings';
import ConstructorsStandings from '../components/ConstructorsStandings';
import PaddockNews           from '../components/PaddockNews';
import StatsRibbon           from '../components/StatsRibbon';
import Footer                from '../components/Footer';

export const revalidate = 60;

export default async function Page() {
  const [calendar, driverStandings, constructorStandings, nextRace, lastRace] =
    await Promise.all([
      getCalendar('2026'),
      getDriverStandings('2026'),
      getConstructorStandings('2026'),
      getNextRace(),
      getLastRaceResults('2026'),
    ]);

  const drivers      = driverStandings.length      ? driverStandings      : FALLBACK_DRIVERS;
  const constructors = constructorStandings.length ? constructorStandings : FALLBACK_CONSTRUCTORS;
  const race         = nextRace ?? FALLBACK_NEXT_RACE;

  const leader    = drivers[0] ?? {};
  const wccLeader = constructors[0] ?? {};
  const verDriver = drivers.find(d => (d.Driver?.familyName ?? '').toLowerCase().includes('verstappen'));
  const verPos    = verDriver ? drivers.indexOf(verDriver) + 1 : 9;
  const verGap    = verDriver ? Number(leader.points ?? 0) - Number(verDriver.points ?? 0) : 60;

  const tickerItems = [
    { sym: 'WDC',      val: (leader.Driver?.familyName ?? 'ANTONELLI').toUpperCase(),                              pts: `${leader.points ?? 72} PTS` },
    { sym: 'WCC',      val: (wccLeader.Constructor?.name ?? 'MERCEDES').split(' ')[0].toUpperCase(),               pts: `${wccLeader.points ?? 135} PTS` },
    { sym: 'NEXT',     val: (race.raceName ?? 'MIAMI GRAND PRIX').replace(' Grand Prix', ' GP').toUpperCase(),     pts: race.date ?? 'MAY 3' },
    { sym: 'WINNER',   val: (leader.Driver?.familyName ?? 'ANTONELLI').toUpperCase(),                              pts: 'LATEST' },
    { sym: 'FL',       val: (drivers[1]?.Driver?.familyName ?? 'RUSSELL').toUpperCase(),                           pts: '1:28.411' },
    { sym: 'FAST PIT', val: 'MCLAREN',                                                                             pts: '1.94s' },
    { sym: 'VER',      val: `-${verGap}`,                                                                          pts: `P${verPos}` },
    { sym: 'ROOKIE',   val: 'ANTONELLI',                                                                           pts: `${leader.points ?? 72} PTS` },
  ];

  return (
    <>
      <Ticker items={tickerItems} />
      <Hero />
      <div className="race-hero-section" style={{ maxWidth:'1440px', margin:'0 auto', padding:'0 36px' }}>
        <RaceHero race={race} />
      </div>
      <Calendar races={calendar} nextRace={race} />
      <section className="main-section" style={{ maxWidth:'1440px', margin:'0 auto', padding:'56px 36px 0' }}>
        <div className="main-grid">
          <DriversStandings      standings={drivers} />
          <ConstructorsStandings standings={constructors} />
          <PaddockNews           lastRace={lastRace} news={STATIC_NEWS} />
        </div>
      </section>
      <StatsRibbon drivers={drivers} constructors={constructors} />
      <Footer />
    </>
  );
}
