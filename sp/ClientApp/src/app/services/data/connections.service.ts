import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICommonService } from '../common.service';
import { ContactModel } from '../../models/contacts/contact-model';
import { SearchModel } from '../../models/contacts/search-model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ConnectionsService {

    CONNECTIONS_SERVICE_URI: string = environment.webServiceURL + "connection/";
    requestQuery: string;

    constructor(public httpClient: HttpClient, public common: ICommonService) { }

    async getMyConnectionsList(memberID: string) {

        let lst = new Array<ContactModel>();
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}GetMemberConnections?memberID=${memberID}&show=`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async searchMemberConnections(memberID: string, searchText: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}SearchMemberConnections?memberID=${memberID}&searchText=${searchText}`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getMyConnections(memberId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}GetMemberConnections?memberID=${memberId}&show=`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async deleteConnection(memberId: string, contactId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}DeleteConnection?memberID=${memberId}&contactID=${contactId}`;
        await this.httpClient.delete(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async getConnectionRequests(memberId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}GetMemberConnections?memberID=${memberId}&show=Requests`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getConnectionSuggestions(memberId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}GetMemberConnectionSuggestions?memberID=${memberId}`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async acceptRequest(memberId: string, contactId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}AcceptRequest?memberID=${memberId}&contactID=${contactId}`;
        await this.httpClient.put(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async rejectRequest(memberId: string, contactId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}RejectRequest?memberID=${memberId}&contactID=${contactId}`;
        await this.httpClient.put(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async getSearchConnections(memberId: string, searchText: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}GetSearchConnections?userID=${memberId}&searchText=${searchText}`;
        let responseData = await this.httpClient.get<Array<ContactModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async addConnection(memberId: string, contactId: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}SendRequestConnection?memberID=${memberId}&contactID=${contactId}`;
        await this.httpClient.put(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async getSearchList(memberId: string, searchText: string) {
        this.requestQuery = `${this.CONNECTIONS_SERVICE_URI}SearchResults?memberID=${memberId}&searchText=${searchText}`;
        let responseData = await this.httpClient.get<Array<SearchModel>>(this.requestQuery,
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