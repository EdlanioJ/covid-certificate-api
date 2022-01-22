import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

import { CaseService } from './case.service';
import { CaseApiResponse } from './types/response.type';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../test/mocks/config.service';

describe('CasesService', () => {
  let service: CaseService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CaseService,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();

    service = module.get<CaseService>(CaseService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCases', () => {
    const axiosResponse: AxiosResponse<CaseApiResponse> = {
      data: {
        active: 1,
        cases: 1,
        country: 'Angola',
        critical: 1,
        deaths: 1,
        recovered: 1,
        todayCases: 1,
        todayDeaths: 1,
        todayRecovered: 1,
        updated: 1,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    it('should send http response', async () => {
      const spy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosResponse));

      await service.getCases();

      expect(spy).toHaveBeenCalled();
    });
  });
});
