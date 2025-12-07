import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseOptionalUUIDPipe implements PipeTransform<string, string | undefined> {
  transform(value: string, metadata: ArgumentMetadata): string | undefined {
    if (!value) {
      return undefined;
    }
    if (!isUUID(value)) {
      return undefined;
    }
    return value;
  }
}

