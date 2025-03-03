import { TestBed } from '@angular/core/testing';

import { MedicalHistoryService } from './medical-history.service';

describe('MedicalHistoryService', () => {
  let service: MedicalHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
