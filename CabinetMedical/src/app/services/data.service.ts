import { Injectable } from '@angular/core';

interface MongoId {
  $oid: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  transformMongoId(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformMongoId(item));
    }

    if (data && typeof data === 'object' && !(data instanceof Date)) {
      const transformed: any = {};
      for (const [key, value] of Object.entries(data)) {
        if ((key === '_id' || key.endsWith('_id')) && value && typeof value === 'object' && '$oid' in value) {
          transformed[key] = (value as MongoId).$oid;
        } else {
          transformed[key] = this.transformMongoId(value);
        }
      }
      return transformed;
    }

    return data;
  }
}
