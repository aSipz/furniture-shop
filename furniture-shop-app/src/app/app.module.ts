import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { BehaviorSubject } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { appInterceptorProvider } from './app.interceptor';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { InitialModule } from './initial/initial.module';
import { API_ERROR } from './initial/constants';
import { StoreModule } from '@ngrx/store';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store'

import { reducers } from './+store';
import { CustomSerializer } from './+store/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    InitialModule,
    CoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer, navigationActionTiming: NavigationActionTiming.PostActivation }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), trace: true })
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
