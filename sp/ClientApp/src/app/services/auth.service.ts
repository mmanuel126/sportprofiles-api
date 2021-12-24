import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/user.model'
import { Register } from '../models/register.model';
import { Login } from '../models/login.model'
import { SessionMgtService } from '../services/session-mgt.service';

@Injectable()

export class AuthService implements IAuthService {

    constructor(private httpClient: HttpClient, public session: SessionMgtService) {

    }

  ACCOUNT_SERVICE_URI: string = environment.webServiceURL  + "account/";
  MEMBERS_SERVICE_URI: string = environment.webServiceURL  + "member/";

    async login(_loginModel: Login) {
        let requestQuery = `${this.ACCOUNT_SERVICE_URI}login`;
        let requestData = { email: _loginModel.email, password: _loginModel.password };
      let response = await this.httpClient.post<UserModel>(requestQuery, requestData,
        { headers: { 'Content-Type': 'application/json' } }).toPromise();
        return response;
    }

    async validateNewRegisteredUser(email: string, code: string) {
        let requestQuery = `${this.ACCOUNT_SERVICE_URI}loginNewRegisteredUser`;
        let requestData = { email: email, code: code };
        let response = await this.httpClient.post<UserModel>(requestQuery, requestData).toPromise();
        return response;
    }

    async register(body: Register): Promise<string> {
        var url = `${this.ACCOUNT_SERVICE_URI}register`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(url, requestData,
            { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }).toPromise();
        return response.toString();
    }

    async resetPassword(email: string): Promise<string> {
        var url = `${this.MEMBERS_SERVICE_URI}ResetPassword?email=${email}`;
        let response = await this.httpClient.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
        // let wcfRequest = await this.httpClient.get(url).toPromise();
        return response.toString();
    }

    async isResetCodeExpired(code: string): Promise<string> {
        var url = `${this.MEMBERS_SERVICE_URI}IsResetCodeExpired?code=${code}`;
        let response = await this.httpClient.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
        return response.toString();
    }

    async changePassword(model: Register) {
        var url = `${this.MEMBERS_SERVICE_URI}ChangePassword?pwd=${model.password}&email=${model.email}&code=${model.code}`;
        let response = await this.httpClient.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }
        ).toPromise();
        return response.toString();
    }

    async setMemberStatus(memberId: string, status: string) {
        var url = `${this.MEMBERS_SERVICE_URI}SetMemberStatus?memberId=${memberId}&status=${status}`;
        let response = await this.httpClient.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }
        ).toPromise();
        return response.toString();
    }

}

export abstract class IAuthService {
    abstract login(loginModel: Login): Promise<UserModel>;
    abstract validateNewRegisteredUser(email: string, code: string): Promise<UserModel>;
    abstract register(reg: Register): Promise<string>;
    abstract resetPassword(email: string): Promise<string>;
    abstract isResetCodeExpired(code: string): Promise<string>;
    abstract changePassword(model: Register): Promise<string>;
    abstract setMemberStatus(memberId: string, status: string);
}
