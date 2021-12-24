import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JobsModel } from '../models/jobs.model';
import { AdsModel } from '../models/ads.model';

@Injectable()

export class AdsService implements IAdsService {

    COMMON_SERVICE_URI: string = environment.webServiceURL + "common/";
    requestQuery: string;

    constructor(public http: HttpClient) { }

    async getGitHubJobs() {
        let lst = new Array<JobsModel>();
        this.requestQuery = `${this.COMMON_SERVICE_URI}GetGitHubJobs`;
        this.requestQuery = "https://jobs.github.com/poson?description=";
        let responseData = await this.http.get("https://cors-anywhere.herokuapp.com/" + this.requestQuery,
            { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=utf-8' } }).toPromise();

        responseData = Array.of(responseData);
        let obj = responseData[0]; //get second level data only
        for (var i = 0; i < obj.length; i++) {
            let mp = new JobsModel();
            mp.id = obj[i].id;
            mp.description = obj[i].description;
            mp.location = obj[i].location;
            mp.company = obj[i].company;
            mp.company_logo = obj[i].company_logo;
            mp.company_url = obj[i].company_url;
            mp.created_at = obj[i].created_at;
            mp.title = obj[i].title;
            mp.type = obj[i].type;
            mp.url = obj[i].url;
            mp.how_to_apply = obj[i].how_to_apply;
            lst.push(mp);
        }
        return lst;
    }

    async getAds(type: string) {

        this.requestQuery = `${this.COMMON_SERVICE_URI}GetAds?type=${type}`;
        let responseData = await this.http.get<Array<AdsModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

}

export class JobParams {
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    full_time: string;
}

export abstract class IAdsService {
    abstract getGitHubJobs(n): Promise<Array<JobsModel>>;
    abstract getAds(type: string);
}
