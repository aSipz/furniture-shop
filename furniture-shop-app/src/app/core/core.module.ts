import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { SharedModule } from '../shared/shared.module';
import { ErrorComponent } from './error/error.component';
import { ProfileSubmenuComponent } from './profile-submenu/profile-submenu.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    GlobalLoaderComponent,
    ErrorComponent,
    ProfileSubmenuComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    GlobalLoaderComponent,
    ModalComponent
  ],
})
export class CoreModule { }
