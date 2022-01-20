import { Test, TestingModule } from '@nestjs/testing';

import { casesStubs } from '../../test/stubs/cases.stub';

import { CaseController } from './case.controller';
import { CaseService } from './case.service';

jest.mock('./case.service', () =>
  jest.requireActual('../../test/mocks/case.service'),
);

describe('CasesController', () => {
  let controller: CaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseController],
      providers: [CaseService],
    }).compile();

    controller = module.get<CaseController>(CaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCases', () => {
    it('should return cases class', async () => {
      const expectedCases = casesStubs();
      const cases = await controller.getCases();
      expect(cases).toEqual(expectedCases);
    });
  });
});
