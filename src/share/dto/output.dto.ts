import { ApiPropertyOptional } from '@nestjs/swagger';

export class OutputDTO {
  @ApiPropertyOptional()
  stdout?: string;

  @ApiPropertyOptional()
  stderr?: string;
}
