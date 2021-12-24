import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './errors/error.component';

/* account components */
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './account/forgotpwd.component';
import { ConfirmRegisterComponent } from './account/confirm-register.component';
import { ResetPwdComponent } from './account/resetpwd.component';
import { ChangePwdComponent } from './account/changepwd.component';
import { ResetPwdConfirmComponent } from './account/resetpwd-confirm.component';
import { AccountSettingComponent } from "./settings/account-setting.component";
import { PrivacySettingComponent } from "./settings/privacy-setting.component";
import { AuthGuardService } from './services/auth-guard-service';
import { ShowProfileComponent} from './members/show-profile/show-profile.component';
import { EditProfileComponent} from './members/edit-profile/edit-profile.component';
import { CompleteRegisterComponent} from "./account/complete-register.component";

//messages
import { ViewMessagesComponent } from './messages/view-messages/view-messages.component';
import { ViewNotificationsComponent } from './messages/view-notifications/view-notifications.component';

//connections
 import { MyConnectionsComponent } from './connections/my-connections.component';
 import { RequestsComponent } from './connections/requests.component';
 import  {FindConnectionsComponent } from './connections/find-connections.component';
 
 //networks
 import {NetworksComponent} from './networks/networks.component';
 import {NetworkInfoComponent} from './networks/network-info.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'account', component: LoginComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuardService] },
  { path: 'forgotpwd', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-register', component: ConfirmRegisterComponent },
  { path: 'resetpwd', component: ResetPwdComponent },
  { path: 'changepwd', component: ChangePwdComponent },
  { path: 'resetpwd-confirm', component: ResetPwdConfirmComponent },
  { path: 'settings/account-setting', component: AccountSettingComponent,canActivate: [AuthGuardService]  },
  { path: 'settings/privacy-setting', component: PrivacySettingComponent,canActivate: [AuthGuardService]  },
  { path: 'members/show-profile', component: ShowProfileComponent },
  { path: 'members/edit-profile', component: EditProfileComponent },
  { path: 'complete-register', component: CompleteRegisterComponent },
  { path: 'messages/view-messages', component: ViewMessagesComponent },
  { path: 'messages/view-notifications', component: ViewNotificationsComponent },
  { path: 'connections/my-connections', component: MyConnectionsComponent},
  { path: 'connections/requests', component: RequestsComponent},
  { path: 'connections/find-connections', component: FindConnectionsComponent},
  { path: 'networks/networks', component: NetworksComponent},
  { path: 'networks/network-info', component: NetworkInfoComponent},
  { path: 'errors', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
