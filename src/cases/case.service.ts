import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { CaseApiResponse } from './types/response.type';
import { Cases } from './entities/cases.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCases() {
    let cases: Cases;

    await this.httpService
      .get<CaseApiResponse>(this.configService.get('CORONA_API_URL'), {
        headers: {
          Accept: 'application/json',
        },
      })
      .pipe(map((response) => response.data))
      .forEach((response) => {
        cases = new Cases({
          countryInfo: {
            flag: response.countryInfo.flag,
            iso: response.countryInfo.iso2,
          },
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
