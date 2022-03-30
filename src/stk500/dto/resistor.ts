import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Max, Min } from 'class-validator';

export class ResistorDTO {
  @ApiProperty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(32)
  @Max(4095)
  resistor: number;
}
