import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPubPage } from './add-pub.page';

describe('AddPubPage', () => {
  let component: AddPubPage;
  let fixture: ComponentFixture<AddPubPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
