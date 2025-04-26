import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../../services/document.service';
import {DocumentUploadPage} from "../document-upload/document-upload.page";
import {DocumentListPage} from "../document-list/document-list.page";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.page.html',
  standalone: true,
  imports: [
    DocumentUploadPage,
    DocumentListPage,
    IonicModule
  ],
  styleUrls: ['./document-management.page.scss']
})

export class DocumentManagementPage implements OnInit {
  documents: any[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    // @ts-ignore
    this.documentService.getDocuments().subscribe((docs: any[]) => {
      this.documents = docs.map(doc => ({
        ...doc,
        id: doc.id?.$oid || doc._id?.$oid || doc._id
      }));
    });
  }

  onDocumentUploaded(document: any) {
    this.documents.push(document);
  }
}
