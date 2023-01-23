import { ApiProperty } from '@nestjs/swagger';
import { devicePortType } from '../interfaces/device-port.type';

export class DevicePortDTO {
  @ApiProperty()
  devicePort: devicePortType;

  constructor(val) {
    if (!val) {
      this.devicePort = 'default';
    }
  }
}
