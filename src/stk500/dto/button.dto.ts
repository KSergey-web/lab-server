import { IsNumber, isNumber, IsString, Length, Matches, Max, Min, min } from 'class-validator';
import { ApiProperty} from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ButtonDTO {
  @Length(8)
  @ApiProperty()
  @Matches(/[0,1]{8}/)
  buttons: string;

  @ApiProperty()
  @IsString()
  @Matches(/[0,1]\d{4}/)
  resistor: string;
}