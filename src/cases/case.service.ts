import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { CaseApiResponse } from './types/response.type';
import { Cases } from './entities/cases.entity';

@Injectable()
export class CaseService {
  constructor(private readonly httpService: HttpService) {}

  async getCases() {
    let cases: Cases;

    await this.httpService
      .get<CaseApiResponse>(
        'https://corona.lmao.ninja/v2/countries/Angola?yesterday=true&strict=true',
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .pipe(map((response) => response.data))
      .forEach((response) => {
        cases = new Cases({
          active: response.active,
          cases: response.cases,
          country: response.country,
          critical: response.critical,
          deaths: response.deaths,
          recovered: response.recovered,
          todayCases: response.todayCases,
          todayDeaths: response.todayDeaths,
          todayRecovered: response.todayRecovered,
          updated: new Date(response.updated),
        });
      });

    return cases;
  }
}
