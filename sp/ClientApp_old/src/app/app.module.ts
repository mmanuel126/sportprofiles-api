import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { CommonModule, DatePipe, PathLocationStrategy } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

//import { YouTubePlayerModule } from '@angular/youtube-player';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

//import {   , , MatSelectModule, MatIconModule, MatTabsModule } from '@angular/material';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/global-error.handler';



import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NGXLogger, /*NGXMapperService, NGXLoggerHttpService, LoggerConfig*/ } from 'ngx-logger';

//import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { LoginComponent } from './account/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './account/register.component';
import { ForgotPasswordComponent } from './account/forgotpwd.component';

import { NavbarComponent } from './components/navbar.component'
import { FooterComponent } from './components/footer.component';
import { NoLoginFooterComponent } from './components/nologin-footer.component';

import { SiteAdsComponent } from './components/ads/site-ads.component';
import { SponsoredAdsComponent } from './components/ads/sponsored-ads.component';
import { GoogleAdsComponent } from './components/ads/google-ads.component';


//services
import { SessionMgtService } from './services/session-mgt.service';
import { MembersService } from './services/data/members.service';
import { CommonService, ICommonService } from './services/common.service';
import { AuthService, IAuthService } from './services/auth.service';
import { MessagesService } from './services/data/messages.service';
import { OrganizationsService, IOrganizationsService } from './services/data/organizations.service';
import { SettingsService, ISettingsService } from './services/data/settings.service';
import { ConnectionsService } from './services/data/connections.service';
import { NetworksService, INetworksService } from './services/data/networks.service';
import { EventsService } from './services/data/events.service';
import { StateService } from './services/state.service';
import { AdsService, IAdsService } from './services/ads.service';
import { ErrorLogService } from './services/error-log.service';
import { AuthGuardService } from './services/auth-guard-service';

//interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    NavbarComponent, FooterComponent, NoLoginFooterComponent,
    RegisterComponent, ForgotPasswordComponent,
    SiteAdsComponent, SponsoredAdsComponent, GoogleAdsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

    CarouselModule, PaginationModule,
    PerfectScrollbarModule, NgxPaginationModule, 
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule, MatTabsModule,
    
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://localhost:5005/services/common/logs',
      level: NgxLoggerLevel.ERROR,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false
    })
  ],
  providers: [SessionMgtService, MembersService, CommonService,
    ConnectionsService, NetworksService, EventsService, CommonService,
    MessagesService, AuthService, StateService, AdsService,
    ErrorLogService, AuthGuardService,
  { provide: IAuthService, useClass: AuthService },
  { provide: IAdsService, useClass: AdsService },
  { provide: ICommonService, useClass: CommonService },
  { provide: ISettingsService, useClass: SettingsService },
  { provide: IOrganizationsService, useClass: OrganizationsService },
  { provide: INetworksService, useClass: NetworksService },
  
  NGXLogger, /*NGXMapperService, NGXLoggerHttpService, LoggerConfig */,
  DatePipe, /*Title*/,
  // register global error handler
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  {
    provide:
      PERFECT_SCROLLBAR_CONFIG,
    // DROPZONE_CONFIG,
   // useValue:
      //DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    // DEFAULT_DROPZONE_CONFIG,
    useClass: PathLocationStrategy
  },

],
  bootstrap: [AppComponent]
})
export class AppModule { }
