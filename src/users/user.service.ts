import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../schemas/certificate.schema';

import { UserDocument, UserModelName } from '../schemas/user.schema';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>,
    @InjectModel(CertificateModelName)
    private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    const certificate = await this.certificateModel.findOne({
      ownerId: user._id,
    });
    return new User({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      certificateId: certificate && certificate.id,
      createdAt: user.createdAt,
    });
  }
}
