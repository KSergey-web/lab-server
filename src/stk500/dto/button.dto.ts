import { IsString, Length } from 'class-validator';
import { ApiProperty} from '@nestjs/swagger';

export class ButtonDTO {
  @Length(8)
  @ApiProperty()
  buttons: string;

  @IsString()
  @Length(5)
  @ApiProperty()
  resistor: string;
}