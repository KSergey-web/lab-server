import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class ButtonDTO {
  @ApiProperty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @Min(0)
  @Max(3)
  buttonInd: number;
}
