import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDoctorPage } from './add-doctor.page';

describe('AddDoctorPage', () => {
  let component: AddDoctorPage;
  let fixture: ComponentFixture<AddDoctorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
