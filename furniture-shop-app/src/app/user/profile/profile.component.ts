import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ModalComponent } from 'src/app/core/modal/modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  get user() {
    return this.userService.user;
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService,
    public modal: MatDialog
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
        this.loaderService.showLoader()
        this.userService.deleteProfile().subscribe({
          next: () => {
            this.router.navigate(['/']);
            this.loaderService.hideLoader();
          },
          error: (err) => {
            console.log(err);
            this.loaderService.hideLoader();
          }
        });
      }

    });
  }
}
