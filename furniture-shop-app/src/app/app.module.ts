import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { appInterceptorProvider } from './app.interceptor';
import { API_ERROR } from './shared/constants';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    UserModule
  ],
  providers: [
    appInterceptorProvider,
    {
      provide: API_ERROR,
      useValue: new BehaviorSubject(null)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
