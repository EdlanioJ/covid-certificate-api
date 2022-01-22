/* eslint-disable @typescript-eslint/no-unused-vars */
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';

import { CertificateController } from './certificate.controller';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CertificateModelName } from '../schemas/certificate.schema';
import { DeleteCertificateService } from './services/delete-certificate/delete-certificate.service';
import { FindOneCertificateService } from './services/find-one-certificate/find-one-certificate.service';
import { Certificate } from './entities/certificate.entity';

import { certificateStub } from '../../test/stubs/certificate.stub';

jest.mock('./services/delete-certificate/delete-certificate.service', () =>
  jest.requireActual('../../test/mocks/delete-certificate.service'),
);
jest.mock('./services/find-one-certificate/find-one-certificate.service', () =>
  jest.requireActual('../../test/mocks/find-one-certificate.service'),
);

describe('CertificatesController', () => {
  let controller: CertificateController;
  let deleteCertificateService: DeleteCertificateService;
  let findOneCertificateService: FindOneCertificateService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [
        {
          provide: getQueueToken('certificate-queue'),
          useValue: {
            add: jest.fn(),
          },
        },
        DeleteCertificateService,
        FindOneCertificateService,
      ],
    }).compile();

    queue = module.get<Queue>(getQueueToken('certificate-queue'));
    deleteCertificateService = module.get<DeleteCertificateService>(
      DeleteCertificateService,
    );
    findOneCertificateService = module.get<FindOneCertificateService>(
      FindOneCertificateService,
    );
    controller = module.get<CertificateController>(CertificateController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should call queue', async () => {
      const dto: CreateCertificateDto = {
        certificateCode: 'certificateCode',
      };
      const ownerId = 'ownerId';
      const job = 'add-certificate-job';

      const spy = jest.spyOn(queue, 'add').mockResolvedValue({} as any);
      await controller.create(dto, ownerId);

      expect(queue.add).toHaveBeenCalled();
      expect(queue.add).toHaveBeenCalledWith(
        job,
        { certificateCode: dto.certificateCode, ownerId },
        { attempts: 3 },
      );
      expect(spy).toBeCalled();
    });
  });

  describe('findOne', () => {
    let certificate: Certificate;
    const id = certificateStub().id.toString();
    const ownerId = 'ownerId';

    beforeEach(async () => {
      certificate = await controller.findOne(id, ownerId);
    });

    it('should call findOneCertificateService', () => {
      expect(findOneCertificateService.execute).toHaveBeenCalledWith(
        id,
        ownerId,
      );
    });

    it('should return a certificate', () => {
      expect(certificate).toEqual(certificateStub());
    });
  });

  describe('remove', () => {
    it('should call deleteCertificateService', async () => {
      const id = certificateStub().id;
      const ownerId = 'ownerId';

      await controller.remove(id, ownerId);
      expect(deleteCertificateService.execute).toHaveBeenCalledWith(
        id,
        ownerId,
      );
    });
  });
});
