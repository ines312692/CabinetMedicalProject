import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilPage } from './accueil.page';

describe('AccueilPage', () => {
  let component: AccueilPage;
  let fixture: ComponentFixture<AccueilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
