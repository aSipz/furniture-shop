import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService
  ) {
    this.loaderService.showLoader();
    this.userService.logout().subscribe({
      next: () => {
        this.loaderService.hideLoader();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hideLoader();
        this.router.navigate(['/']);
      }
    });
  }

}
