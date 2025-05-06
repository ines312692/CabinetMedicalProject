import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageriePage } from './messagerie.page';

describe('MessageriePage', () => {
  let component: MessageriePage;
  let fixture: ComponentFixture<MessageriePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageriePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
