import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifProfilPatientPage } from './modif-profil-patient.page';

describe('ModifProfilPatientPage', () => {
  let component: ModifProfilPatientPage;
  let fixture: ComponentFixture<ModifProfilPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifProfilPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
