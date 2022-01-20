import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CertificateModelName,
  CertificateDocument,
} from '../../../schemas/certificate.schema';
import { Certificate } from '../../entities/certificate.entity';

@Injectable()
export class FindOneCertificateService {
  constructor(
    @InjectModel(CertificateModelName)
    private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async execute(id: string, ownerId: string) {
    const certificate = await this.certificateModel.findOne({
      id: id,
      ownerId: new Types.ObjectId(ownerId),
    });

    return new Certificate({
      id: certificate.id,
      vaccineName: certificate.vaccineName,
      vaccineDoses: certificate.vaccineDoses,
      certificateId: certificate.certificateId,
      certificateOwnerName: certificate.certificateOwnerName,
      certificateIssueDate: certificate.certificateIssueDate,
      certificateImageSource: certificate.certificateImageSource,
      createdAt: certificate.createdAt,
    });
  }
}
