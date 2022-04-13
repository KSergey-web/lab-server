import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ButtonsDTO {
  @Length(4)
  @ApiProperty()
  @IsString()
  @Matches(/[0,1]{4}/)
  buttons: string;
}
