import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';
import { FindOneCertificateService } from './find-one-certificate.service';

describe('FindOneCertificateService', () => {
  let service: FindOneCertificateService;
  let model: Model<CertificateDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneCertificateService,
        {
          provide: getModelToken(CertificateModelName),
          useValue: Model,
        },
      ],
    }).compile();

    model = module.get<Model<CertificateDocument>>(
      getModelToken(CertificateModelName),
    );
    service = module.get<FindOneCertificateService>(FindOneCertificateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findOne', async () => {
    const id = '123456789123';
    const ownerId = '123456789123';
    const spy = jest.spyOn(model, 'findOne').mockResolvedValue({} as any);
    await service.execute(id, ownerId);

    expect(spy).toBeCalled();
  });
});
