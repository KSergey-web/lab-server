import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ButtonsDTO {
  @Length(1)
  @ApiProperty()
  @IsString()
  @Matches(/[0,1]{1}/)
  buttons: string;
}
