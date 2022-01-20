import { Test, TestingModule } from '@nestjs/testing';

import { CertificateProcessor } from './certificate.processor';
import { AddCertificateService } from './services/add-certificate/add-certificate.service';

jest.mock('./services/add-certificate/add-certificate.service', () =>
  jest.requireActual('./tests/mocks/add-certificate.service'),
);
describe('CertificateProcessor', () => {
  let processor: CertificateProcessor;
  let addCertificateService: AddCertificateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateProcessor, AddCertificateService],
    }).compile();

    processor = module.get<CertificateProcessor>(CertificateProcessor);
    addCertificateService = module.get<AddCertificateService>(
      AddCertificateService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('createCertificate', () => {
    const job: any = {
      data: { certificateCode: 'certificateCode', ownerId: 'ownerId' },
    };

    it('should call addCertificateService.execute', async () => {
      await processor.createCertificate(job);
      expect(addCertificateService.execute).toHaveBeenCalledTimes(1);
      expect(addCertificateService.execute).toHaveBeenCalledWith(
        job.data.certificateCode,
        job.data.ownerId,
      );
    });
  });
});
