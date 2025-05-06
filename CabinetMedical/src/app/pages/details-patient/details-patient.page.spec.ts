import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPatientPage } from './details-patient.page';

describe('DetailsPatientPage', () => {
  let component: DetailsPatientPage;
  let fixture: ComponentFixture<DetailsPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
