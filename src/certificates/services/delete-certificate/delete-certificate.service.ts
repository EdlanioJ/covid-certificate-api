import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';

@Injectable()
export class DeleteCertificateService {
  constructor(
    @InjectModel(CertificateModelName)
    private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async execute(id: string, ownerId: string) {
    await this.certificateModel.findByIdAndDelete({
      id: id,
      ownerId: new Types.ObjectId(ownerId),
    });
  }
}
