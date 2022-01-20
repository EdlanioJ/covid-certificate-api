import { Cases } from '../../src/cases/entities/cases.entity';

export const casesStubs = (): Cases =>
  new Cases({
    active: 1,
    cases: 1,
    country: 'Angola',
    critical: 1,
    deaths: 1,
    recovered: 1,
    todayCases: 1,
    todayDeaths: 1,
    todayRecovered: 1,
    updated: new Date(2022, 1, 10),
  });
