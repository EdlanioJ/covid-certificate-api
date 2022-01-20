import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { Queue } from 'bull';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { DeleteCertificateService } from './services/delete-certificate/delete-certificate.service';
import { FindOneCertificateService } from './services/find-one-certificate/find-one-certificate.service';
import { Certificate } from './entities/certificate.entity';

@ApiBearerAuth()
@ApiTags('certificates')
@Controller('certificates')
@UseGuards(JwtGuard)
export class CertificateController {
  constructor(
    @InjectQueue('certificate-queue') private readonly certificateQueue: Queue,
    private readonly deleteCertificateService: DeleteCertificateService,
    private readonly findOneCertificateService: FindOneCertificateService,
  ) {}

  @ApiNoContentResponse({ description: 'Add certificate' })
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @Body() dto: CreateCertificateDto,
    @GetCurrentUser('sub') ownerId: string,
  ) {
    await this.certificateQueue.add(
      'add-certificate-job',
      { certificateCode: dto.certificateCode, ownerId },
      { attempts: 3 },
    );
  }

  @ApiOkResponse({
    type: Certificate,
    description: 'Get certificate by userId and ownerId',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @GetCurrentUser('sub') ownerId: string) {
    return this.findOneCertificateService.execute(id, ownerId);
  }

  @ApiNoContentResponse({ description: 'Delete certificate by id and owner' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetCurrentUser('sub') ownerId: string) {
    return this.deleteCertificateService.execute(id, ownerId);
  }
}
