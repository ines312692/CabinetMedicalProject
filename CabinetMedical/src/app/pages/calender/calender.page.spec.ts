import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalenderPage } from './calender.page';

describe('CalenderPage', () => {
  let component: CalenderPage;
  let fixture: ComponentFixture<CalenderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
