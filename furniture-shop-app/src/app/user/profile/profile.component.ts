import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { ModalComponent } from 'src/app/core/modal/modal.component';
import { getUser } from 'src/app/+store/selectors';
import { deleteProfile } from 'src/app/+store/actions/userActions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user$ = this.store.select(getUser);

  constructor(
    private router: Router,
    public modal: MatDialog,
    private store: Store,
  ) { }

  onEditClick(): void {
    this.router.navigate(['/user/edit-profile'])
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete profile',
      text: 'Are you sure that you want to delete your profile?'
    };

    const dialogRef = this.modal.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(deleteProfile());
      }

    });
  }
}
