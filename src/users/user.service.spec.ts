import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { userModelStub } from '../../test/stubs/user-model.stub';

import {
  CertificateModelName,
  CertificateDocument,
} from '../schemas/certificate.schema';
import { UserDocument, UserModelName } from '../schemas/user.schema';
import { UserService } from './user.service';

describe('UsersService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let certificateModel: Model<CertificateDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    userModel = module.get<Model<UserDocument>>(getModelToken(UserModelName));
    certificateModel = module.get<Model<CertificateDocument>>(
      getModelToken(CertificateModelName),
    );
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const id = 'id';

    it('should return a user with no certificateId', async () => {
      const userResponse = userModelStub();
      jest.spyOn(userModel, 'findById').mockResolvedValue(userResponse as any);
      jest.spyOn(certificateModel, 'findOne').mockResolvedValue(undefined);
      const user = await service.findOne(id);
      expect(user.id).toEqual(userResponse.id);
      expect(user.avatar).toEqual(userResponse.avatar);
      expect(user.certificateId).toBe(undefined);
    });

    it('should return a user with certificateId', async () => {
      const userResponse = userModelStub();
      const certificateResponse = { id: 'id' };
      jest.spyOn(userModel, 'findById').mockResolvedValue(userResponse as any);
      jest
        .spyOn(certificateModel, 'findOne')
        .mockResolvedValue(certificateResponse as any);
      const user = await service.findOne(id);
      expect(user.id).toEqual(userResponse.id);
      expect(user.avatar).toEqual(userResponse.avatar);
      expect(user.certificateId).toBe(certificateResponse.id);
    });
  });
});
