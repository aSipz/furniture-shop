import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { FileUploadService } from '../services/file-upload.service';
import { ModalComponent } from 'src/app/core/modal/modal.component';
import { FileUpload } from 'src/app/initial/constants';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Output() imageEvent = new EventEmitter<any[]>();

  @Input() imageInfos: any[] = [];

  selectedFiles?: FileList;
  progressInfos: any[] = [];

  previews: string[] = [];

  timerIds: ReturnType<typeof setTimeout>[] = [];
  fileReaders: FileReader[] = [];

  sub: Subscription;

  constructor(
    private uploadService: FileUploadService,
    public modal: MatDialog
  ) {
    this.sub = this.uploadService.files$.subscribe({
      next: (file) => {

        this.imageInfos.push(file);

        this.imageEvent.emit(this.imageInfos);
      }
    });
  }

  ngOnDestroy(): void {
    this.timerIds.forEach(i => clearTimeout(i));
    this.fileReaders.forEach(r => {
      if (r.readyState === 1) {
        r.abort();
      }
    });
    this.sub.unsubscribe();
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

  openModal(fileUpload: FileUpload) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete Image',
      text: 'Are you sure that you want to delete this image?',
      imageUrl: fileUpload.url
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        fileUpload.isLoading = true;
        this.uploadService.deleteFileStorage(fileUpload).subscribe({
          next: () => {
            if (this.imageInfos) {
              this.imageInfos = this.imageInfos.filter(e => e !== fileUpload);
            }
            this.imageEvent.emit(this.imageInfos);
          },
          error: (err) => {
            console.log(err);
            fileUpload.isLoading = false;
          }
        })
      }
    });
  }

  private hideMsg(progressIndex: number, time: number): void {
    const tId = setTimeout(() => {
      this.progressInfos = this.progressInfos.filter(i => i.index !== progressIndex);
      this.timerIds = this.timerIds.filter(t => t !== tId);
    }, time);
    this.timerIds.push(tId);
  }

}
