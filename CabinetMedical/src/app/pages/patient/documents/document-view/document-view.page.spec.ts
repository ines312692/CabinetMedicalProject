import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentViewPage } from './document-view.page';

describe('DocumentViewPage', () => {
  let component: DocumentViewPage;
  let fixture: ComponentFixture<DocumentViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
