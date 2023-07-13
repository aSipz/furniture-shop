import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';
import { FileUpload } from 'src/app/shared/constants';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Output() imageEvent = new EventEmitter<any[]>();

  selectedFiles?: FileList;
  progressInfos: any[] = [];

  previews: string[] = [];
  imageInfos?: any[];

  timerIds: ReturnType<typeof setTimeout>[] = [];
  fileReaders: FileReader[] = [];

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.uploadService.getFiles().snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.imageEvent.emit(fileUploads);
      this.imageInfos = fileUploads;
    });
  }

  ngOnDestroy(): void {
    this.timerIds.forEach(i => clearTimeout(i));
    this.fileReaders.forEach(r => {
      if (r.readyState === 1) {
        r.abort();
      }
    });
    this.imageInfos?.forEach(i => this.uploadService.deleteFileDatabase(i.key));
  }

  reset() {
    this.fileInput.nativeElement.value = '';
    this.selectedFiles = undefined;
    this.previews = [];
    this.fileReaders.forEach(r => {
      if (r.readyState === 1) {
        r.abort();
      }
    });
    this.fileReaders = [];
  }

  selectFiles(event: any): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {

      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        this.fileReaders.push(reader);

        reader.onload = (e: any) => {

          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }

    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name, index: idx };

    if (file) {
      this.uploadService.pushFileToStorage(new FileUpload(file)).subscribe({
        next: percentage => {
          this.progressInfos[idx].value = Math.round(percentage ? percentage : 0);
        },
        error: error => {
          console.log(error);
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.progressInfos[idx].msg = msg;
          this.hideMsg(idx, 3000);
        },
        complete: () => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.progressInfos[idx].msg = msg;
          this.hideMsg(idx, 3000);
        }
      });
    }
  }

  uploadFiles(): void {

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
      this.reset();
    }
  }

  deleteFileUpload(fileUpload: FileUpload): void {
    this.uploadService.deleteFile(fileUpload)
      .then(() => {
        if (this.imageInfos) {
          this.imageInfos = this.imageInfos.filter(e => e !== fileUpload);
        }
      })
      .catch(err => console.log(err)
      );
  }

  private hideMsg(progressIndex: number, time: number): void {
    const tId = setTimeout(() => {
      this.progressInfos = this.progressInfos.filter(i => i.index !== progressIndex);
      this.timerIds = this.timerIds.filter(t => t !== tId);
    }, time);
    this.timerIds.push(tId);
  }
}
