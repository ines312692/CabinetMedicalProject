import { TestBed } from '@angular/core/testing';

import { PubserviceService } from './pubservice.service';

describe('PubserviceService', () => {
  let service: PubserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PubserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
