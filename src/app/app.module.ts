import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
//Interceptor class that automatically acquires tokens for outgoing requests that use the Angular http client to known protected resources.
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; 

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor } from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        //register the app with Azure cloud services to get
        clientId: 'cf1505bf-30f4-4715-ad5e-9b9d6f4a08a3',
        //This is the instance of the Azure cloud. For the main or global Azure cloud, enter https://login.microsoftonline.com followed by tenant ID
        authority: 'https://login.microsoftonline.com/1026e629-701a-4451-8edb-12c8e75cffef', // This is your tenant ID
        // authorization_endpoint: "https://login.microsoftonline.com/1026e629-701a-4451-8edb-12c8e75cffef/oauth2/v2.0/authorize",
        // token_endpoint: "https://login.microsoftonline.com/1026e629-701a-4451-8edb-12c8e75cffef/oauth2/v2.0/token",
        // token_endpoint_auth_methods_supported: [
        //   "client_secret_post",
        //   "private_key_jwt"
        // ],
        //must match exactly to Azure register application, check under Authentication page
        redirectUri: 'http://localhost:4200/',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
        }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([ 
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard // MsalGuard added as provider here
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }