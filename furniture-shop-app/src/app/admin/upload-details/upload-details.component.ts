import { Component, Input } from '@angular/core';

import { FileUpload } from 'src/app/shared/constants';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent {

  @Input() fileUpload!: FileUpload;

  constructor(private uploadService: FileUploadService) { }

  deleteFileUpload(fileUpload: FileUpload): void {
    this.uploadService.deleteFile(fileUpload);
  }
}
