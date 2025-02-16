import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentListPage } from './document-list.page';

describe('DocumentListPage', () => {
  let component: DocumentListPage;
  let fixture: ComponentFixture<DocumentListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
