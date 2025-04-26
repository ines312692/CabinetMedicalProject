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
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if ((key === '_id' || key.endsWith('_id')) && value && typeof value === 'object' && '$oid' in value) {
            return [key, (value as MongoId).$oid];
          }
          return [key, this.transformMongoId(value)];
        })
      );
    }

    return data;
  }
}
