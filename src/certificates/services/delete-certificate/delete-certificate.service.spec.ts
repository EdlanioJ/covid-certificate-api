import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';
import { DeleteCertificateService } from './delete-certificate.service';

describe('DeleteCertificateService', () => {
  let service: DeleteCertificateService;
  let model: Model<CertificateDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCertificateService,
        {
          provide: getModelToken(CertificateModelName),
          useValue: Model,
        },
      ],
    }).compile();
    model = module.get<Model<CertificateDocument>>(
      getModelToken(CertificateModelName),
    );
    service = module.get<DeleteCertificateService>(DeleteCertificateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findByIdAndDelete', async () => {
    const id = '123456789123';
    const ownerId = '123456789123';
    const spy = jest
      .spyOn(model, 'findByIdAndDelete')
      .mockResolvedValue({} as any);
    await service.execute(id, ownerId);

    expect(spy).toBeCalled();
  });
});
