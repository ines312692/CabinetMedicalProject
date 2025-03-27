import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentManagementPage } from './document-management.page';

describe('DocumentManagementPage', () => {
  let component: DocumentManagementPage;
  let fixture: ComponentFixture<DocumentManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
