import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { AddCertificateService } from './services/add-certificate/add-certificate.service';

@Processor('certificate-queue')
export class CertificateProcessor {
  constructor(private readonly addCertificateService: AddCertificateService) {}

  @Process('add-certificate-job')
  async createCertificate(job: Job) {
    const { data } = job;
    await this.addCertificateService.execute(
      data.certificateCode,
      data.ownerId,
    );
  }
}
