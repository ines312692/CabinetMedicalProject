import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'mongoId'
})
export class MongoIdPipe implements PipeTransform {
  transform(value: { $oid: string } | string | undefined): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.$oid || '';
  }
}
