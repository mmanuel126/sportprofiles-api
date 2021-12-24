import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SportsListModel } from 'src/app/models/members/profile-member.model';
import { SchoolsByStateModel } from 'src/app/models/organization/schools-by-state.model';
import { AdsModel } from 'src/app/models/ads.model';
import { LogModel } from 'src/app/models/logmodel.model';
import { HttpParams } from "@angular/common/http";

@Injectable()

export class CommonService implements ICommonService {

    COMMON_SERVICE_URI: string = environment.webServiceURL + "common/";
    requestQuery: string;

    constructor(public http: HttpClient) { }

    async encryptString(str: string) {
        this.requestQuery = `${this.COMMON_SERVICE_URI}EncryptString?encrypt=${str}`;
        var response = await this.http.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }, responseType: 'text'
            }).toPromise();
        return response.toString();
    }

    async decryptString(str: string) {
        this.requestQuery = `${this.COMMON_SERVICE_URI}DecryptString?encrypted=${str}`;
        var response = await this.http.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }, responseType: 'text'
            }).toPromise();
        return response.toString();
    }

    async getSportsList() {
        this.requestQuery = `${this.COMMON_SERVICE_URI}GetSportsList`;
        let responseData = await this.http.get<Array<SportsListModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();

        return responseData;
    }

    async getSchoolsByState(state: string, instType: string) {
        this.requestQuery = `${this.COMMON_SERVICE_URI}GetSchoolByState?state=${state}&institutionType=${instType}`;
        let responseData = await this.http.get<Array<SchoolsByStateModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async logError(message: string, stack: string) {
        this.requestQuery = `${this.COMMON_SERVICE_URI}Logs`;
        var params = new HttpParams()
            .append('message', message)
            .append('stack', stack);
        let response = await this.http.get(this.requestQuery, { params: params }).toPromise();
    }
}

export abstract class ICommonService {
    abstract encryptString(str: string): Promise<string>;
    abstract decryptString(str: string): Promise<string>;
    abstract getSportsList(): Promise<Array<SportsListModel>>;
    abstract getSchoolsByState(state: string, instType: string);
    abstract logError(message: string, stack: string);
}

