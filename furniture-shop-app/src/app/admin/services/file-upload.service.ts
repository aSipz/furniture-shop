import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, catchError, finalize, firstValueFrom } from 'rxjs';
import { FileUpload } from 'src/app/shared/constants';

import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath = '/uploads';

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
          this.saveFileData(fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload): void {

    this.db.list(this.basePath).push(fileUpload);
  }

  getFiles(): AngularFireList<FileUpload> {
    return this.db.list(this.basePath);
  }

  deleteFile(fileUpload: FileUpload): Promise<void> {
    return this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        return firstValueFrom(this.deleteFileStorage(fileUpload.name))
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  }

  deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  deleteFileStorage(name: string): Observable<any> {
    const storageRef = this.storage.ref(this.basePath);
    return storageRef.child(name).delete().pipe(
      catchError((error) => {
        throw error;
      })
    )
  }
}
