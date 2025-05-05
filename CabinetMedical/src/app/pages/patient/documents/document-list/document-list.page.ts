import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { DocumentService } from "../../../../services/document.service";
import { NgForOf, NgIf } from "@angular/common";

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
export class DocumentListPage implements OnInit, OnChanges {
  @Input() documents: any[] = [];
  @Input() doctorId: string = '';

  filteredDocuments: any[] = [];

  constructor(
    private readonly documentService: DocumentService,
  ) {}

  ngOnInit() {
    this.filterDocumentsByDoctor();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-filter documents when either documents array or doctorId changes
    if (changes['documents'] || changes['doctorId']) {
      this.filterDocumentsByDoctor();
    }
  }

  filterDocumentsByDoctor() {
    if (!this.doctorId || !this.documents.length) {
      this.filteredDocuments = [];
      return;
    }

    this.filteredDocuments = this.documents.filter(doc => {
      const docDoctorId = typeof doc.doctor_id === 'object'
        ? doc.doctor_id
        : doc.doctor_id.$oid;

      return docDoctorId === this.doctorId;

    });
    console.log('Filtered documents:', this.filteredDocuments);
  }

  deleteDocument(documentId: string) {
    if (!documentId) {
      console.error('Document ID is undefined');
      return;
    }
    this.documentService.deleteDocument(documentId).subscribe(() => {
      this.documents = this.documents.filter(doc => doc.id !== documentId);
      this.filteredDocuments = this.filteredDocuments.filter(doc => doc.id !== documentId);
    }, error => {
      console.error('Error deleting document', error);
    });
  }
}
