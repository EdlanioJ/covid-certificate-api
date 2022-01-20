import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CaseService } from './case.service';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Cases } from './entities/cases.entity';

@ApiBearerAuth()
@ApiTags('cases')
@Controller('cases')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @ApiOkResponse({
    type: Cases,
    description: 'Find all cases of covid-19 in angola in last 24h',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getCases() {
    return this.caseService.getCases();
  }
}
