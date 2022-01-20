import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';

import { CertificateController } from './certificate.controller';
import {
  CertificateModelName,
  CertificateSchema,
} from '../schemas/certificate.schema';
import { AddCertificateService } from './services/add-certificate/add-certificate.service';
import { FindOneCertificateService } from './services/find-one-certificate/find-one-certificate.service';
import { DeleteCertificateService } from './services/delete-certificate/delete-certificate.service';
import { CertificateProcessor } from './certificate.processor';
import { BullModule } from '@nestjs/bull';
import { UserModelName, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'certificate-queue',
    }),
    MongooseModule.forFeature([
      { name: CertificateModelName, schema: CertificateSchema },
      { name: UserModelName, schema: UserSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [
    CertificateProcessor,
    AddCertificateService,
    DeleteCertificateService,
    FindOneCertificateService,
  ],
})
export class CertificateModule {}
