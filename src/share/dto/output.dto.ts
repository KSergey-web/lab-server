import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Output } from '../response/output.interface';

export class OutputDTO implements Output{
  @ApiProperty()
  stdout: string;
}
