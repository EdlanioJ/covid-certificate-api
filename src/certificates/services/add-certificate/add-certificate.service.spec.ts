import { getModelToken } from '@nestjs/mongoose';
import * as puppeteer from 'puppeteer';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';
import { UserModelName, UserDocument } from '../../../schemas/user.schema';
import { AddCertificateService } from './add-certificate.service';
import { ForbiddenException } from '@nestjs/common';
import { userModelStub } from '../../../../test/stubs/user-model.stub';

import { mockBrowser, mockPage } from '../../../../test/mocks/puppeteer';
import { certificateModelStub } from '../../../../test/stubs/certificate-model.stub';

jest.mock('puppeteer', () => ({
  launch() {
    return mockBrowser;
  },
}));

describe('AddCertificateService', () => {
  let service: AddCertificateService;
  let userModel: Model<UserDocument>;
  let certificateModel: Model<CertificateDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddCertificateService,
        {
          provide: getModelToken(CertificateModelName),
          useValue: Model,
        },
        {
          provide: getModelToken(UserModelName),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AddCertificateService>(AddCertificateService);
    userModel = module.get<Model<UserDocument>>(getModelToken(UserModelName));
    certificateModel = module.get<Model<CertificateDocument>>(
      getModelToken(CertificateModelName),
    );
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AddCertificateService.execute', () => {
    const certificateCode = 'certificateCode';
    const ownerId = 'ownerId';

    it('should fail if findById user return undefined', async () => {
      const spy = jest.spyOn(puppeteer, 'launch');
      jest.spyOn(userModel, 'findById').mockResolvedValue(undefined);
      const promise = service.execute(certificateCode, ownerId);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(promise).rejects.toThrowError(
        new ForbiddenException('Access  Denied'),
      );
    });

    it('should return new certificate', async () => {
      const gotoSpy = jest.spyOn(mockPage, 'goto');
      const selectorSpy = jest.spyOn(mockPage, 'waitForSelector');
      const clickSpy = jest.spyOn(mockPage, 'click');
      const typeSpy = jest.spyOn(mockPage, 'type');
      const closeSpy = jest.spyOn(mockBrowser, 'close');
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue(userModelStub() as any);
      jest
        .spyOn(certificateModel, 'create')
        .mockResolvedValue(certificateModelStub() as never);
      const certificate = await service.execute(certificateCode, ownerId);
      expect(closeSpy).toHaveBeenCalled();
      expect(gotoSpy).toHaveBeenCalledTimes(1);
      expect(selectorSpy).toHaveBeenCalled();
      expect(typeSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(certificate.id).toEqual(certificateModelStub().id);
    });

    it('should fail if loadCertificateData throw an error', async () => {
      jest.spyOn(mockBrowser, 'newPage').mockRejectedValue(new Error('error'));
      const promise = service.execute(certificateCode, ownerId);
      expect(promise).rejects.toThrowError();
    });
  });
});
