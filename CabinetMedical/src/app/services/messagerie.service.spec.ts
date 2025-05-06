import { TestBed } from '@angular/core/testing';

import { MessagerieService } from './messagerie.service';

describe('MessagerieService', () => {
  let service: MessagerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
