import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { devicePortType } from '../interfaces/device-port.type';

export class DeviceInfoDTO {
  @ApiProperty()
  devicePort: devicePortType;

  @ApiProperty()
  @IsString()
  arduinoPort: devicePortType = '';

  constructor(val) {
    if (!val) {
      this.devicePort = 'default';
    }
  }
}
