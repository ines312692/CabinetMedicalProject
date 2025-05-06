import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllAdvertisementsPage } from './all-advertisements.page';

describe('AllAdvertisementsPage', () => {
  let component: AllAdvertisementsPage;
  let fixture: ComponentFixture<AllAdvertisementsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdvertisementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
