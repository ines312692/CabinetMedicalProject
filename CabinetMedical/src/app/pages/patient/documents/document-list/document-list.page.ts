import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { DocumentService } from "../../../../services/document.service";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.page.html',
  styleUrls: ['./document-list.page.scss'],
  imports: [
    IonicModule,
    NgForOf,

  ],
  standalone: true
})
export class DocumentListPage implements OnInit {
  @Input() documents: any[] = [];

  constructor(
    private documentService: DocumentService,

  ) {}

  ngOnInit() {}

  deleteDocument(documentId: string) {
    if (!documentId) {
      console.error('Document ID is undefined');
      return;
    }
    this.documentService.deleteDocument(documentId).subscribe(() => {
      this.documents = this.documents.filter(doc => doc.id !== documentId);
    }, error => {
      console.error('Error deleting document', error);
    });
  }
}
