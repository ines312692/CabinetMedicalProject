import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorGridPage } from './doctor-grid.page';

describe('DoctorGridPage', () => {
  let component: DoctorGridPage;
  let fixture: ComponentFixture<DoctorGridPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorGridPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
