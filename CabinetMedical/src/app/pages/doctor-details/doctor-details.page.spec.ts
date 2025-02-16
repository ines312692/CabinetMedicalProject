import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorDetailsPage } from './doctor-details.page';

describe('DoctorDetailsPage', () => {
  let component: DoctorDetailsPage;
  let fixture: ComponentFixture<DoctorDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
