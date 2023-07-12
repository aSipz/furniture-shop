import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { min } from 'rxjs';

import { LoaderService } from 'src/app/core/services/loader.service';
import { productCategories } from 'src/app/shared/constants';
import { emailValidator, usernameValidator, nameValidator, sameValueGroupValidator, categoryValidator } from 'src/app/shared/validators';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.css']
})
export class AddNewItemComponent {

  serverError = '';
  categories: string[] = productCategories;

  // console.log(this.categories);


  // _id: string;
  //   name: string;
  //   description: string;
  //   category: string;
  //   color: string;
  //   material: string;
  //   price: number;
  //   discount: number;
  //   quantity: number;
  //   images?: string[];
  //   reviews?: IReview[];
  //   ratings?: IRating[];
  //   createdAt: string;
  //   updatedAt: string;
  //   ownerId?: string;

  addNewForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', [Validators.required, categoryValidator()]],
    color: ['', [Validators.required, Validators.minLength(3)]],
    material: ['', [Validators.required, Validators.minLength(4)]],
    price: ['', [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0)]],
    quantity: ['', [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService
  ) { }

  addNewHandler(): void {

    if (this.addNewForm.invalid) {
      return;
    }

    this.loaderService.showLoader();

    this.addNewForm.disable();

    // const {  } = this.addNewForm.value;

    // this.userService.register().subscribe({
    //   next: () => {
    //     this.router.navigate(['/']);
    //     this.loaderService.hideLoader();
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.serverError = err.error?.message;
    //     this.addNewForm.enable();
    //     this.loaderService.hideLoader();
    //   }

    // });

  }
}
