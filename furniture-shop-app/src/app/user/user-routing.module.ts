import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authActivate } from '../shared/guards/auth.activate';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authActivate],
    data: {
      title: 'Login',
      loginRequired: false,
      animation: 'loginPage'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authActivate],
    data: {
      title: 'Register',
      loginRequired: false,
      animation: 'registerPage'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authActivate],
    data: {
      title: 'Profile',
      loginRequired: true,
      animation: 'profilePage'
    }
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [authActivate],
    data: {
      title: 'Edit Profile',
      loginRequired: true,
      animation: 'editProfilePage'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
