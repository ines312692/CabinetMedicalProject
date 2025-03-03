import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientProfilePage } from './patient-profile.page';

describe('PatientProfilePage', () => {
  let component: PatientProfilePage;
  let fixture: ComponentFixture<PatientProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
