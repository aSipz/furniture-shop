import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

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
    private loaderService: LoaderService
  ) { }

  onEditClick(): void {
    this.router.navigate(['/user/edit-profile'])
  }

  onDeleteClick(): void {
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
}
