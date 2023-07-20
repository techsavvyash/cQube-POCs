import { BadRequestException } from '@nestjs/common';

export class ValidationError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = '1001: Invalid data, does not follow grammar definitions';
  }
}
