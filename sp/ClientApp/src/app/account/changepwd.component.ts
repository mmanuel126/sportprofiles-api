import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Register } from '../models/register.model';
import { IAuthService } from '../services/auth.service';
import { SessionMgtService } from '../services/session-mgt.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-forgotPwd',
    templateUrl: './changepwd.component.html',
    styleUrls: ['./changepwd.component.css'],
})

export class ChangePwdComponent {

    constructor(private route: ActivatedRoute,
        private router: Router, private authSvc: IAuthService, public session: SessionMgtService) { }

    email: string;
    code: string;
    public currentYear = new Date().getFullYear().toString();
    public show: boolean = false;
    public showErrMsg: boolean = false;
    public appLogoText = environment.appLogoText;
    public companyName = environment.companyName;
    public webSiteDomain = environment.webSiteDomain;

    user: Register = {
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

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.email = params.email;
            this.code = params.code;
        });
    }

    async changePassword(changePwdForm: NgForm) {
        this.show = true;
        this.user.email = this.email;
        this.user.code = this.code;
        let result = await this.authSvc.changePassword(this.user);
        if (result != "") {
            let datArray = result.split(":");
            this.router.navigate(['/resetpwd-confirm']);
        }
        else {
            this.showErrMsg = true;
        }
        this.show = false;
    }
}