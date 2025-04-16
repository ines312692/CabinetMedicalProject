import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifProfilAdminPage } from './modif-profil-admin.page';

describe('ModifProfilAdminPage', () => {
  let component: ModifProfilAdminPage;
  let fixture: ComponentFixture<ModifProfilAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifProfilAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
