import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICommonService } from '../common.service';
import { MemberEventsModel } from '../../models/events/member-events-model';
import { environment } from '../../../environments/environment';

@Injectable()
export class EventsService {

    EVENTS_SERVICE_URI: string = environment.webServiceURL + "event/";
    requestQuery: string;

    constructor(public httpClient: HttpClient, public common: ICommonService) { }

    async getMyEventsList(memberID: string) {

        let lst = new Array<MemberEventsModel>();
        this.requestQuery = `${this.EVENTS_SERVICE_URI}GetMemberEvents/${memberID}&show=`;
        let responseData = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();

        responseData = Array.of(responseData);
        let obj = responseData[0]; //get second level data only

        for (var i = 0; i < obj.length; i++) {

            let mp = new MemberEventsModel();

            if (obj[i].eventID != null)
                mp.eventID = obj[i].eventID.toString();
            else mp.eventID = "";

            if (obj[i].cnt != null)
                mp.cnt = obj[i].cnt.toString();
            else mp.cnt = "";

            if (obj[i].planningWhat != null)
                mp.planningWhat = obj[i].planningWhat.toString();
            else mp.planningWhat = "";

            if (obj[i].location != null)
                mp.location = obj[i].location.toString();
            else mp.location = "";

            if (obj[i].eventDate != null)
                mp.eventDate = obj[i].eventDate.toString();
            else mp.eventDate = "";

            if (obj[i].RSVP != null)
                mp.RSVP = obj[i].RSVP.toString();
            else mp.RSVP = "";

            if (obj[i].eventParams != null)
                mp.eventParams = obj[i].eventParams.toString();
            else mp.eventParams = "";

            if (obj[i].startDate != null)
                mp.startDate = obj[i].startDate.toString();
            else mp.startDate = "";

            if (obj[i].endDate != null)
                mp.endDate = obj[i].endDate.toString();
            else mp.endDate = "";

            if (obj[i].showCancel != null)
                mp.showCancel = obj[i].showCancel.toString();
            else mp.showCancel = "";

            if (obj[i].eventImg != null)
                mp.eventImg = "http://www.marcman.xyz/assets/images/events/" + obj[i].eventImg.toString();
            else mp.eventImg = "http://www.marcman.xyz/assets/images/events/" + "default.png";

            lst.push(mp);
        }
        return lst;
    }

    private truncate(value: string, maxLength: number) {
        if ((value == null) || (value == undefined) || (value.length == 0)) return value;
        return (value.length <= maxLength ? value : value.substring(0, maxLength))
    }

    private extractData(res: Response) {
        let body = res
        return body || [];
    }

}