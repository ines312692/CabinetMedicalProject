import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifProfilDoctorPage } from './modif-profil-doctor.page';

describe('ModifProfilDoctorPage', () => {
  let component: ModifProfilDoctorPage;
  let fixture: ComponentFixture<ModifProfilDoctorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifProfilDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
