import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  certificateCode: string;
}
