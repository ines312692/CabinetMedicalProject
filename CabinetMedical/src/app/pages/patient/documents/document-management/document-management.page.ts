import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../../services/document.service';
import { DocumentUploadPage } from "../document-upload/document-upload.page";
import { DocumentListPage } from "../document-list/document-list.page";
import { IonicModule } from "@ionic/angular";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.page.html',
  standalone: true,
  imports: [
    DocumentUploadPage,
    DocumentListPage,
    IonicModule,
    CommonModule
  ],
  styleUrls: ['./document-management.page.scss']
})

export class DocumentManagementPage implements OnInit {
  documents: any[] = [];
  doctorId: string = '';

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the doctor ID from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.doctorId = params['doctorId'];
      }
      this.loadDocuments();
    });
  }

  loadDocuments() {
    // Get documents, potentially filtered by doctor ID and patient ID
    this.documentService.getDocuments().subscribe((docs: unknown) => {
      if (Array.isArray(docs)) {
        this.documents = docs.map(doc => ({
          ...doc,
          id: doc.id?.$oid || doc._id?.$oid || doc._id
        }));
      }
    });
  }

  onDocumentUploaded(document: any) {
    this.documents.push(document);
  }
}
