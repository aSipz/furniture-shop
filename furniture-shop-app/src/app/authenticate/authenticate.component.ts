import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { LoaderService } from '../shared/loader.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {

  isAuthenticating = true;

  constructor(private userService: UserService, private loaderService: LoaderService) {
    this.loaderService.showLoader()
    this.userService.getProfile().subscribe({
      next: () => {
        this.isAuthenticating = false;
        this.loaderService.hideLoader();
      },
      error: () => {
        this.isAuthenticating = false;
        this.loaderService.hideLoader();
      }
    });
  }


}
