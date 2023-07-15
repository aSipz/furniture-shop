import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, catchError, finalize } from 'rxjs';
import { FileUpload } from 'src/app/shared/constants';
import { IImageEntry } from 'src/app/shared/interfaces';

import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath = '/uploads';

  private files$$ = new Subject<IImageEntry>();
  files$ = this.files$$.asObservable();

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const uuid = uuidv4();
    const filePath = `${this.basePath}/${uuid}-${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = `${uuid}-${fileUpload.file.name}`;

          this.files$$.next({ name: fileUpload.name, url: fileUpload.url });
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  deleteFileStorage(fileUpload: FileUpload): Observable<any> {
    const storageRef = this.storage.ref(this.basePath);
    return storageRef.child(fileUpload.name).delete().pipe(
      catchError((error) => {
        throw error;
      })
    )
  }
}
