import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from "@ionic/angular";
import { DocumentService } from "../../../../services/document.service";
import { NgForOf } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.page.html',
  styleUrls: ['./document-list.page.scss'],
  imports: [
    IonicModule,
    NgForOf
  ],
  standalone: true
})
export class DocumentListPage implements OnInit {
  documents: any[] = [];

  constructor(
    private documentService: DocumentService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe((docs: unknown) => {
      this.documents = (docs as any[]).map((doc: any) => {
        const id = doc.id?.$oid || doc._id?.$oid || doc._id;
        if (!id) {
          console.error('Document ID is missing', doc);
        }
        return {
          ...doc,
          id: id
        };
      });
    });
  }

  async viewDocument(document: any) {
    await this.router.navigate(['/document-view', {document: JSON.stringify(document)}]);
   
  }

  deleteDocument(documentId: string) {
    if (!documentId) {
      console.error('Document ID is undefined');
      return;
    }
    this.documentService.deleteDocument(documentId).subscribe(() => {
      this.loadDocuments();
    }, error => {
      console.error('Error deleting document', error);
    });
  }
}
