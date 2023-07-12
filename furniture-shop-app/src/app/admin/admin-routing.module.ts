import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';

const routes: Routes = [
  // {
  //   path: 'user/login',
  //   component: LoginComponent,
  //   canActivate: [authActivate],
  //   data: {
  //     title: 'Login',
  //     loginRequired: false,
  //     animation: 'loginPage'
  //   }
  // },
  // {
  //   path: 'user/register',
  //   component: RegisterComponent,
  //   canActivate: [authActivate],
  //   data: {
  //     title: 'Register',
  //     loginRequired: false,
  //     animation: 'registerPage'
  //   }
  // }
  {
    path: 'add-item',
    component: AddNewItemComponent,
    data: {
      title: 'Add New Product',
      animation: 'addItemPage'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
