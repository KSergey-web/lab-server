import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ButtonsDTO } from './buttons.dto';
import { SwitchesDTO } from './switches.dto';

export class SwitchesAndButtnsDTO extends IntersectionType(
  ButtonsDTO,
  SwitchesDTO,
) {}
