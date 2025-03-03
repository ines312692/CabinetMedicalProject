import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentService } from '../../../../services/document.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.page.html',
  standalone: true,
  imports: [IonicModule],
  styleUrls: ['./document-view.page.scss'],
  providers: [FileOpener]
})
export class DocumentViewPage implements OnInit {
  document: any;

  constructor(
    private route: ActivatedRoute,
    private fileOpener: FileOpener,
    private platform: Platform,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const documentData = this.route.snapshot.paramMap.get('document');
    if (typeof documentData === 'string') {
      this.document = JSON.parse(documentData);
      this.loadDocument(this.document.id);
    }
  }

  loadDocument(documentId: string) {
    this.documentService.getDocumentById(documentId).subscribe((doc: any) => {
      if (doc && doc.url) {
        this.openDocument(doc.url);
      } else {
        console.error('Document URL is missing');
      }
    }, error => {
      console.error('Error loading document', error);
    });
  }

  openDocument(url: string) {
    if (this.platform.is('cordova')) {
      this.fileOpener.open(url, this.getMimeType(url))
        .then(() => console.log('File is opened'))
        .catch((e: any) => console.error('Error opening file', e));
    } else {
      window.open(url, '_blank');
    }
  }

  getMimeType(url: string): string {
    const extension = url.split('.').pop();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'jpg': return 'image/jpeg';
      case 'png': return 'image/png';
      default: return 'application/octet-stream';
    }
  }
}
