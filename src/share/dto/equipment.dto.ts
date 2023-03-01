import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { enumEquipmentType } from '../enum/equipment-type.enum';
import { devicePortType } from '../interfaces/device-port.type';
import { IEquipment } from '../interfaces/equipment.interface';

export class IEquipmentDTO implements IEquipment {
  @ApiPropertyOptional()
  @IsOptional()
  devicePort: devicePortType;

  @ApiPropertyOptional()
  @IsOptional()
  arduinoPort?: devicePortType;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsEnum(enumEquipmentType)
  type: enumEquipmentType;
}
