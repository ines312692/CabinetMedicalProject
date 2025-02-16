import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentUploadPage } from './document-upload.page';

describe('DocumentUploadPage', () => {
  let component: DocumentUploadPage;
  let fixture: ComponentFixture<DocumentUploadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
