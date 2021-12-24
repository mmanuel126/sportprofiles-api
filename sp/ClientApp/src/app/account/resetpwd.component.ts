
import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-resetpwd',
    templateUrl: './resetpwd.component.html',
    styleUrls: ['./resetpwd.component.css'],
})

export class ResetPwdComponent {
    public webSiteDomain = environment.webSiteDomain;
    public appLogoText = environment.appLogoText;
    public isWorking: boolean = false;
    email: string;
    public showErrMsg: boolean = false;

    public constructor(private route: ActivatedRoute, private router: Router, private authSrvc: IAuthService/* private membersSvc: MembersService */) { }

    user: UserDataModel = {
        code: ""
    }

    ngOnInit() {

        this.route.queryParams.pipe(
            filter(params => params.email))
            .subscribe(params => {
                this.email = params.email;
            });

        this.route.queryParams.pipe(
            filter(params => params.code))
            .subscribe(params => {
                this.user.code = params.code;
            });
    }

    async resetPasswordUser(resetPwdForm: NgForm) {
        this.showErrMsg = false;
        this.isWorking = true;
        let e = this.email;
        let c = this.user.code;

        let result = await this.authSrvc.isResetCodeExpired(c);
        if (result == "yes") {
            this.showErrMsg = true;
            this.isWorking = false;
        }
        else {
            this.router.navigate(['/changepwd'], { queryParams: { email: e, code: c } });
        }
    }
}

export class UserDataModel {
    code: string;
}