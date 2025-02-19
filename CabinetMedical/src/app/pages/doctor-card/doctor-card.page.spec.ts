import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorCardPage } from './doctor-card.page';

describe('DoctorCardPage', () => {
  let component: DoctorCardPage;
  let fixture: ComponentFixture<DoctorCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
