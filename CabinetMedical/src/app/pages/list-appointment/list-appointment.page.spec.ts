import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAppointmentPage } from './list-appointment.page';

describe('ListAppointmentPage', () => {
  let component: ListAppointmentPage;
  let fixture: ComponentFixture<ListAppointmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
