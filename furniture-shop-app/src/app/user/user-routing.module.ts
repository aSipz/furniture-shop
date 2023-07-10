import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authActivate } from '../shared/guards/auth.activate';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'user/login',
    component: LoginComponent,
    canActivate: [authActivate],
    data: {
      title: 'Login',
      loginRequired: false,
      animation: 'loginPage'
    }
  },
  {
    path: 'user/register',
    component: RegisterComponent,
    canActivate: [authActivate],
    data: {
      title: 'Register',
      loginRequired: false,
      animation: 'registerPage'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
