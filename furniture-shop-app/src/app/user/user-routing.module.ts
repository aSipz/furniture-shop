import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'user/login',
    component: LoginComponent,
    data: {
      title: 'Login',
      loginRequired: false
    }
  },
  {
    path: 'user/register',
    component: RegisterComponent,
    data: {
      title: 'Register',
      loginRequired: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
