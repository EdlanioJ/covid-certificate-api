import { casesStubs } from '../stubs/cases.stub';

export const CaseService = jest.fn().mockResolvedValue({
  getCases: jest.fn().mockResolvedValue(casesStubs()),
});
