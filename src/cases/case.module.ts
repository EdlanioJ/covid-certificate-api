import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CaseController } from './case.controller';
import { CaseService } from './case.service';

@Module({
  imports: [HttpModule],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
