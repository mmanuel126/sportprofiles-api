import { Component, OnInit } from '@angular/core';
import { Login } from '../models/login.model';
import { MembersService } from '../services/data/members.service';
import { IAuthService } from '../services/auth.service'
import { SessionMgtService } from '../services/session-mgt.service';
import { Router } from "@angular/router";
import { throwError } from 'rxjs';
import { MessagesService } from '../services/data/messages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public webSiteDomain = environment.webSiteDomain;
  public currentYear = new Date().getFullYear().toString();
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;
  result: string = "";
  public isLoading = false;
  userID: string;

  modHand: NgbModalRef;

  login: Login = {
    email: "",
    password: "",
  }

  public constructor(public ngbMod: NgbModal, public members: MembersService,
    public authSvc: IAuthService, public session: SessionMgtService, private router: Router, public msgSvc: MessagesService) {
  }

  ngOnInit() {
    if (this.session.getSessionVal('isUserLogin') == "true") {
      this.router.navigate(['/home']);
    }
  }

  async loginUser() {
    throwError(null);
    this.isLoading = true;
    let response = await this.authSvc.login(this.login);
    if (response.memberID != null) {
      this.session.setSessionVar('isUserLogin', 'true');
      this.session.setSessionVar('userID', response.memberID);
      this.userID = response.memberID;
      this.session.setSessionVar('userEmail', response.email);
      this.session.setSessionVar('userTitle', response.title);
      this.session.setSessionVar('userName', response.name);
      localStorage.setItem("access_token", response.accessToken);
      if (response.picturePath != "") {
        this.session.setSessionVar('userImage', response.picturePath);
      }
      else {
        this.session.setSessionVar('userImage', "default.png");
      }
      this.session.setSessionVar('pwd', this.login.password);
      this.result = "found";
      this.router.navigate(['/home']);
    }
    else {
      this.session.setSessionVar('isUserLogin', 'false');
      this.result = "notfound";
      this.isLoading = false;
    }
  }

  async showOpenPopup(openModal) {
    this.modHand = this.ngbMod.open(openModal);
    return false;
  }

 
}
class alertbox {
    show() {
      alert()
    }
}


