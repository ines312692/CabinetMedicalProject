import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD:CabinetMedical/src/app/services/chat-service.service.spec.ts
import { ChatService } from './chat-service.service';

describe('ChatServiceService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
=======

import { MessagerieService } from './messagerie.service';

describe('MessagerieService', () => {
  let service: MessagerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagerieService);
>>>>>>> 10b90c8584f187e9e2e79b7da696f6d3b1c50b3b:CabinetMedical/src/app/services/messagerie.service.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
