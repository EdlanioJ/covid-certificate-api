import { CaseApiResponse } from '../../src/cases/types/response.type';

export const caseApiResponseStub = (): CaseApiResponse => ({
  active: 1,
  cases: 1,
  country: 'Angola',
  countryInfo: {
    flag: 'ao.png',
    iso2: 'ao',
  },
  critical: 1,
  deaths: 1,
  recovered: 1,
  todayCases: 1,
  todayDeaths: 1,
  todayRecovered: 1,
  updated: 1,
});
