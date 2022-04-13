import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ButtonsAndResistorDTO {
  @Length(8)
  @ApiProperty()
  @Matches(/[0,1]{8}/)
  buttons: string;

  @ApiProperty()
  @IsString()
  @Matches(/[0,1]\d{4}/)
  resistor: string;
}
