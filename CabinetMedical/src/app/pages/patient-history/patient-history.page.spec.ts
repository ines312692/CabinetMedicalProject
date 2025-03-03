import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientHistoryPage } from './patient-history.page';

describe('PatientHistoryPage', () => {
  let component: PatientHistoryPage;
  let fixture: ComponentFixture<PatientHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
