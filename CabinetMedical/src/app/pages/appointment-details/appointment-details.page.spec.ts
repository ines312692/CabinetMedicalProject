import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentDetailsPage } from './appointment-details.page';

describe('AppointmentDetailsPage', () => {
  let component: AppointmentDetailsPage;
  let fixture: ComponentFixture<AppointmentDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
