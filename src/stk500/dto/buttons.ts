import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches } from "class-validator";

export class ButtonsDTO {
    @Length(8)
    @ApiProperty()
    @IsString()
    @Matches(/[0,1]{8}/)
    buttons: string;
  }