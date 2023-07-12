import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';
import { FileUpload } from 'src/app/shared/constants';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit {

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: any[];

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.uploadService.getFiles(6).snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.imageInfos = fileUploads;
    });
    // this.imageInfos = this.uploadService.getFiles(10);
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      // this.uploadService.upload(file).subscribe({
      //   next: (event: any) => {
      //     if (event.type === HttpEventType.UploadProgress) {
      //       this.progressInfos[idx].value = Math.round(
      //         (100 * event.loaded) / event.total
      //       );
      //     } else if (event instanceof HttpResponse) {
      //       const msg = 'Uploaded the file successfully: ' + file.name;
      //       this.message.push(msg);
      //       this.imageInfos = this.uploadService.getFiles();
      //     }
      //   },
      //   error: (err: any) => {
      //     this.progressInfos[idx].value = 0;
      //     const msg = 'Could not upload the file: ' + file.name;
      //     this.message.push(msg);
      //   },
      // });
      // this.currentFileUpload = new FileUpload(file);
      this.uploadService.pushFileToStorage(new FileUpload(file)).subscribe({
        next: percentage => {
          this.progressInfos[idx].value = Math.round(percentage ? percentage : 0);
        },
        error: error => {
          console.log(error);
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        },
        complete: () => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.message.push(msg);
          // this.imageInfos = this.uploadService.getFiles(10);
        }
      });
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
}
