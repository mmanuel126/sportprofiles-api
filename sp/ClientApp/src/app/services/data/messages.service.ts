import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICommonService } from '../common.service';
import { SearchMessageInfoModel } from '../../models/messages/search-message-info.model';
import { environment } from '../../../environments/environment';
import { MemberNotificationsModel } from '../../models/messages/member-notifications.model';

@Injectable()
export class MessagesService implements IMessagesService {

    MESSAGES_SERVICE_URI: string = environment.webServiceURL + "message/";
    requestQuery: string;

    constructor(public httpClient: HttpClient, public common: ICommonService) { }

    async getMemberMessages(memberID: string, type: string, showType: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}GetMemberMessages/${memberID}?type=${type}&showType=${showType}`;
        let responseData = await this.httpClient.get<Array<SearchMessageInfoModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async toggleMessageState(status: string, msgID: string, folder: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}ToggleMessageState?status=${status}&msgID=${msgID}&folder=${folder}`;
        let responseData = await this.httpClient.put(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async deleteMessage(msgId: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}DeleteMessage/${msgId}`;
        let responseData = await this.httpClient.delete(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async searchMessage(memberId: string, searchKey: string, type: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}SearchMessages/${memberId}?searchKey=${searchKey}&type=${type}`;
        let responseData = await this.httpClient.get<Array<SearchMessageInfoModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async sendMessage(memberId: string, senderId: string, subject: string, msg: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}CreateMessage?to=${senderId}&from=${memberId}&subject=${subject}&body=${msg}`;
        let responseData = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async getUnReadMessagesCount(memberId: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}GetTotalUnreadMessages/${memberId}`;
        var response = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return response.toString();

    }

    async getMemberNotifications(memberID: string, showType: string) {
        this.requestQuery = `${this.MESSAGES_SERVICE_URI}GetMemberNotifications/${memberID}?showType=${showType}`;
        let responseData = await this.httpClient.get<Array<MemberNotificationsModel>>(this.requestQuery,
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

export abstract class IMessagesService {
    abstract getMemberMessages(memberID: string, type: string, showType: string)
    abstract toggleMessageState(status: string, msgID: string, folder: string);
    abstract deleteMessage(msgId: string);
    abstract searchMessage(memberId: string, searchKey: string, type: string);
    abstract getMemberNotifications(memberID: string, showType: string);
    abstract getUnReadMessagesCount(memberId: string);
    abstract sendMessage(memberId: string, senderId: string, subject: string, msg: string);
}