import { Component, OnInit } from '@angular/core';
import { Register } from '../models/register.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public webSiteDomain = environment.webSiteDomain;
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  public show: boolean = false;
  public terms: boolean = false;

  public showErrMsg: boolean = false;

  genders = ['Female', 'Male'];
  profileTypes = ['Agent', 'Athlete (Amateur)', 'Athlete (Professional)', 'Athletic Trainer', 'Coach', 'Management', 'Referee', 'Retired', 'Scout', 'Sports Fanatic']

  register: Register = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPwd: "",
    gender: "select",
    month: "Month",
    day: "Day",
    year: "Year",
    code: "",
    profileType: "select",
  }

  constructor(private route: ActivatedRoute, private router: Router, private authSvc: IAuthService) { }

  scroll =(event): void => {};
  ngOnInit() {
    window.addEventListener('scroll',this.scroll,true);
  }

  async registerUser(registerForm: NgForm) {

    this.show = true;
    this.showErrMsg = false;

    let result = await this.authSvc.register(this.register);
    //result = "NewEmail";
    if (result == "ExistingEmail") {
      this.showErrMsg = true;
    }
    else if (result == "NewEmail") {
      this.router.navigate(['/confirm-register'], { queryParams: { email: this.register.email } });
    }
    this.show = false;
  }

}
