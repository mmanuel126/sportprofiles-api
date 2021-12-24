
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe, PathLocationStrategy } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatTabsModule } from '@angular/material';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/global-error.handler';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NGXLogger, NGXMapperService, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar.component'
import { FooterComponent } from './components/footer.component';
import { NoLoginFooterComponent } from './components/nologin-footer.component';

import { SiteAdsComponent } from './components/ads/site-ads.component';
import { SponsoredAdsComponent } from './components/ads/sponsored-ads.component';
import { GoogleAdsComponent } from './components/ads/google-ads.component';

import { HttpClientModule } from '@angular/common/http';

import { ErrorComponent } from './errors/error.component';

//account components
import { LoginComponent } from './account/login.component';

import { RegisterComponent } from './account/register.component';
import { ForgotPasswordComponent } from './account/forgotpwd.component';
import { ConfirmRegisterComponent } from './account/confirm-register.component';
import { ResetPwdComponent } from './account/resetpwd.component';
import { ChangePwdComponent } from './account/changepwd.component';
import { ResetPwdConfirmComponent } from './account/resetpwd-confirm.component';
import { CompleteRegisterComponent } from "./account/complete-register.component";

//home components
import { HomeComponent } from './home/home.component';

//account settings
import { AccountSettingComponent } from "./settings/account-setting.component";
import { AccountSettingNameComponent } from "./settings/account-setting-name.component";
import { AccountSettingEmailComponent } from "./settings/account-setting-email.component";
import { AccountSettingPasswordComponent } from "./settings/account-setting-password.component";
import { AccountSettingSecQuetionsComponent } from "./settings/account-setting-secQuestions.component";
import { AccountSettingNotificationsComponent } from "./settings/account-setting-notifications.component";
import { AccountSettingDeactivateComponent } from "./settings/account-setting-deactivate.component";
import { AccountSettingChangePhotoComponent } from "./settings/account-setting-change-photo.component";
import { PrivacySettingComponent } from "./settings/privacy-setting.component";
import { PrivacySettingProfileComponent } from "./settings/privacy-setting-profile.component";
import { PrivacySettingSearchComponent } from "./settings/privacy-setting-search.component";

//member show and edit profile
import { ShowProfileComponent } from './members/show-profile/show-profile.component';
import { EditProfileComponent } from './members/edit-profile/edit-profile.component';
import { UserInfoComponent } from "./members/edit-profile/user-info.component";
import { ContactInfoComponent } from "./members/edit-profile/contact-info.component";
import { EducationInfoComponent } from "./members/edit-profile/education-info.component";
import { EmploymentInfoComponent } from "./members/edit-profile/employment-info.component";
import { AboutInfoComponent } from "./members/edit-profile/about-info.component";

//messages
import { ViewMessagesComponent } from './messages/view-messages/view-messages.component';
import { ViewNotificationsComponent } from './messages/view-notifications/view-notifications.component';

//connections
import { MyConnectionsComponent } from './connections/my-connections.component';
import { RequestsComponent } from './connections/requests.component';
import { FindConnectionsComponent } from './connections/find-connections.component';

//networks
import { NetworksComponent } from './networks/networks.component';
import { NetworkInfoComponent } from './networks/network-info.component';
import { NetworkBasicInfoComponent } from './networks/network-basic-info.component';
import { NetworkPostsComponent } from './networks/network-posts.component';
import { DiscussionBoardComponent } from './networks/discussion-board.component';
import { NetworkEventsComponent } from './networks/network-events.component';
import { NetworkMembersComponent } from './networks/network-members.component';
import { NetworkAdminsComponent } from './networks/network-admins.component';
import { NetworkSettingComponent } from './networks/network-settings.component';
import { NetworkSettingChangePhotoComponent } from './networks/network-setting-change-photo.component';

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


// directives
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { SelectRequiredValidatorDirective } from './directives/select-required-validator.directive';
import { EqualValidatorDirective } from './directives/confirm-pwd-validator.directive';


//interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalsService } from './services/modal.services';
import { ModalComponent } from './components';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,

    //account compopents
    LoginComponent, RegisterComponent, ForgotPasswordComponent, HomeComponent,
    ConfirmRegisterComponent, ResetPwdComponent, ResetPwdConfirmComponent, ChangePwdComponent,
    CompleteRegisterComponent,
    NavbarComponent, FooterComponent, NoLoginFooterComponent, SiteAdsComponent, SponsoredAdsComponent, GoogleAdsComponent,
    AccountSettingComponent,
    AccountSettingNameComponent,
    AccountSettingEmailComponent,
    AccountSettingPasswordComponent,
    AccountSettingSecQuetionsComponent,
    AccountSettingNotificationsComponent,
    AccountSettingDeactivateComponent,
    AccountSettingChangePhotoComponent,
    PrivacySettingComponent,
    PrivacySettingProfileComponent,
    PrivacySettingSearchComponent,
    ShowProfileComponent,
    EditProfileComponent, UserInfoComponent,
    ContactInfoComponent, EducationInfoComponent, EmploymentInfoComponent, AboutInfoComponent,
    SelectRequiredValidatorDirective, EqualValidatorDirective, BootstrapTabDirective,
    ViewMessagesComponent, ViewNotificationsComponent, MyConnectionsComponent, RequestsComponent, FindConnectionsComponent,
    NetworksComponent, NetworkInfoComponent,
    NetworkBasicInfoComponent, NetworkPostsComponent, DiscussionBoardComponent, NetworkEventsComponent,
    NetworkMembersComponent, NetworkAdminsComponent, NetworkSettingComponent,
    NetworkSettingChangePhotoComponent,
    ModalComponent, ErrorComponent,
  ],
  imports: [
    BrowserModule, YouTubePlayerModule,
    AppRoutingModule,
    CommonModule,
    FormsModule, HttpClientModule, NgbModule,
    CarouselModule, PaginationModule,
    PerfectScrollbarModule, NgxPaginationModule, BrowserAnimationsModule,
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
    NGXLogger, NGXMapperService, NGXLoggerHttpService, LoggerConfig,
    DatePipe, Title,
    // register global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    {
      provide:
        PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
        DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
      useClass: PathLocationStrategy
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
