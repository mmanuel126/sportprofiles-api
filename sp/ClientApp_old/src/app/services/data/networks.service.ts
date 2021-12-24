import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICommonService } from '../common.service';
import { NetworkInfoModel, NetworkPostsModel, NetworkPostChildModel, CategoryModel, CategoryTypeModel, NetworkTopicsModel, NetworkMemberModel, NetworkSettingsModel } from '../../models/networks/network-info-model';
import { environment } from '../../../environments/environment';
import { MemberEventsModel } from 'src/app/models/events/member-events-model';


@Injectable()
export class NetworksService {

    NETWORKS_SERVICE_URI: string = environment.webServiceURL + "network/";
    requestQuery: string;

    constructor(public httpClient: HttpClient, public common: ICommonService) { }

    async getNetworkResults(tryValue: string) {
        let lst = new Array<NetworkInfoModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}SearchTOPxNetworkResults?tryValue=${tryValue}`;
        let responseData = await this.httpClient.get<Array<NetworkInfoModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getMyNetworksList(memberID: string) {

        let lst = new Array<NetworkInfoModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetMemberNetworks/${memberID}`;
        let responseData = await this.httpClient.get<Array<NetworkInfoModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkBasicInfo(networkID: string) {

        let lst = new Array<NetworkInfoModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkBasicInfo/${networkID}`;
        let responseData = await this.httpClient.get<Array<NetworkInfoModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkPosts(networkID: string) {

        let lst = new Array<NetworkPostsModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkPosts/${networkID}`;
        let responseData = await this.httpClient.get<Array<NetworkPostsModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();

        for (var i = 0; i < responseData.length; i++) {
            var postID = responseData[i].postID;
            this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkPostResponses/${postID}`;
            let childDat = await this.httpClient.get<Array<NetworkPostChildModel>>(this.requestQuery,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'authorization': 'Bearer ' + localStorage.getItem("access_token")
                    }
                }).toPromise();
            responseData[i].children = childDat;
        }
        return responseData;
    }

    async getCategoryList() {
        let lst = new Array<CategoryModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkCategories`;
        let responseData = await this.httpClient.get<Array<CategoryModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getCategoryTypeList(catID: string) {
        let lst = new Array<CategoryTypeModel>();
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkCategoryTypes/${catID}`;
        let responseData = await this.httpClient.get<Array<CategoryTypeModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkTopics(networkID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkDiscussionTopics/${networkID}`;
        let responseData = await this.httpClient.get<Array<NetworkTopicsModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getTopicPosts(topicID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetTopicPosts/${topicID}`;
        let responseData = await this.httpClient.get<Array<NetworkPostsModel>>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async updateNetworkInfo(netInfoModel: NetworkInfoModel) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}UpdateNetworkInfo`;
        let requestData = JSON.stringify(netInfoModel);
        let response = await this.httpClient.post(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();

    }

    async doPost(networkID: string, memberID: string, postText: string, postID: string) {
        if (postID == "0") {
            this.requestQuery = `${this.NETWORKS_SERVICE_URI}CreateNetworkPost/${networkID}/${memberID}?postMsg=${postText}`;
        }
        else {
            this.requestQuery = `${this.NETWORKS_SERVICE_URI}CreatePostComment/${networkID}/${memberID}/${postID}?postMsg=${postText}`;
        }
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
    }

    async doNetTopicPost(memberID: string, topicID: string, postText: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}CreatePostCommentByTopicID/${memberID}/${topicID}?postMsg=${postText}`;
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
    }

    async doCreateTopic(networkID: string, memberID: string, topicName: string, postText: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}CreateTopic/${networkID}/${memberID}?topicName=${topicName}&post=${postText}`;
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
    }

    async deleteNetDiscTopic(topicID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}DeleteNetworkTopic/${topicID}`;
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
    }

    async getNetworkEvents(networkID: string, memberID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkEvents/${networkID}/${memberID}`;
        let responseData = await this.httpClient.get<MemberEventsModel[]>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkMembers(networkID: string) {
        let listType = "joined";
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkMembers/${networkID}?listType=${listType}`;
        let responseData = await this.httpClient.get<NetworkMemberModel[]>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkAdmins(networkID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkAdmins/${networkID}`;
        let responseData = await this.httpClient.get<NetworkMemberModel[]>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getNetworkSettings(networkID: string) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}GetNetworkSettings/${networkID}`;
        let responseData = await this.httpClient.get<NetworkSettingsModel[]>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async saveNetworkSettings(networkID: string, nsModel: NetworkSettingsModel) {
        this.requestQuery = `${this.NETWORKS_SERVICE_URI}UpdateNetworkSettings`;
        let response = await this.httpClient.put(this.requestQuery, nsModel,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
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

export abstract class INetworksService {
    abstract getMyNetworksList(memberID: string);
    abstract getNetworkBasicInfo(networkID: string);
    abstract getCategoryList();
    abstract getCategoryTypeList(catID: string);
    abstract updateNetworkInfo(netInfoModel: NetworkInfoModel);
    abstract doPost(networkID: string, memberID: string, postText: string, postType: string);
    abstract doCreateTopic(networkID: string, memberID: string, topicName: string, postText: string);
    abstract deleteNetDiscTopic(topicID: string);
    abstract getNetworkMembers(networkID: string);
    abstract getNetworkAdmins(networkID: string);
    abstract getNetworkSettings(networkID: string);
    abstract saveNetworkSettings(networkID: string, nsModel: NetworkSettingsModel);
}