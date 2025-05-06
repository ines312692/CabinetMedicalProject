import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversationPage } from './conversation.page';

describe('ConversationPage', () => {
  let component: ConversationPage;
  let fixture: ComponentFixture<ConversationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
