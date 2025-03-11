import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentConfirmationPage } from './appointment-confirmation.page';

describe('AppointmentConfirmationPage', () => {
  let component: AppointmentConfirmationPage;
  let fixture: ComponentFixture<AppointmentConfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
