import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RecentNewsModel } from '../../models/recent-news.model';
import { RecentPostsModel, RecentPostChildModel } from '../../models/recent-posts.model';
import { ICommonService } from '../../services/common.service';
import { SessionMgtService } from '../../services/session-mgt.service';

import { InstagramUserModel, MemberProfileBasicInfoModel, MemberProfileBasicInfoSaveModel, YoutubePlayListModel, YoutubeVideosListModel } from '../../models/members/profile-member.model';
import { MemberProfileEducationModel } from '../../models/members/profile-education.model';
import { MemberProfileEmploymentModel } from '../../models/members/profile-employment.model';
import { MemberProfileContactInfoModel } from '../../models/members/profile-contact-info.model';
import { MemberProfileAboutModel } from '../../models/members/profile-about.model';
import { RegisteredUser } from '../../models/registered-user.model';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class MembersService {

    headers = new HttpHeaders({
        'Content-Type': 'application/text; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    });

    MEMBERS_SERVICE_URI: string = environment.webServiceURL + "member/";
    ORGANIZATIONS_SERVICE_URI: string = environment.webServiceURL + "organizations/";
    requestQuery: string;
    helper = new JwtHelperService();
    accessToken = localStorage.getItem("access_token");

    constructor(public httpClient: HttpClient, public common: ICommonService, public session: SessionMgtService, public auth: AuthService) {
    }

    // authenticates user from service data call
    async AuthenticateUser(email: string, pwd: string, rememberMe: string, screen: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}AuthenticateUser?email=${email}&pwd=${pwd}&rememberMe=${rememberMe}&screen=${screen}`;
        var response = await this.httpClient.get(this.requestQuery, { responseType: 'text' }).toPromise();
        return response.toString();
    }

    // Get recent news
    async getRecentNews() {
        let lst = new Array<RecentNewsModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}getRecentNews`;
        let responseData = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        responseData = Array.of(responseData);
        let mainData = responseData[0];

        for (var i = 0; i < mainData.length; i++) {
            let AddNewsArray = new RecentNewsModel();
            if (mainData[i].imageUrl != null)
                AddNewsArray.newsImgUrl = mainData[i].imageUrl.toString().replace("~", "").replace("Images", "images");
            else
                AddNewsArray.newsImgUrl = "/images/RecentNews/default.png";

            if (mainData[i].headerText != null)
                AddNewsArray.newsTitle = mainData[i].headerText;
            else
                AddNewsArray.newsTitle = "";

            if (mainData[i].postingDate != null) {
                var date = new Date(mainData[i].postingDate);
                var dtFormat = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
                AddNewsArray.newsDatePosted = dtFormat;
            }
            else
                AddNewsArray.newsDatePosted = "";

            if (mainData[i].textField != null)
                AddNewsArray.newsDetail = this.truncate(mainData[i].textField, 120);
            else
                AddNewsArray.newsDetail = "";

            if (mainData[i].navigateUrl != null)
                AddNewsArray.newsUrl = mainData[i].navigateUrl;
            else
                AddNewsArray.newsUrl = "";

            if (mainData[i].id != null)
                AddNewsArray.newsID = mainData[i].id;
            else
                AddNewsArray.newsID = "";

            lst.push(AddNewsArray);
        }
        return lst;
    }

    //get recent posts
    async getRecentPosts(memberID: string) {
        let lst = new Array<RecentPostsModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}getRecentPosts/${memberID}`;
        let responseData = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
                // params: { 'memberID': memberID }
            }
        ).toPromise();

        responseData = Array.of(responseData);
        let obj = responseData[0]; //get second level data only
        for (var i = 0; i < obj.length; i++) {
            let mp = new RecentPostsModel();
            if (obj[i].picturePath != null)
                mp.picturePath = obj[i].picturePath.toString();
            else mp.picturePath = "";

            if (obj[i].datePosted != null)
                mp.datePosted = obj[i].datePosted.toString();
            else mp.datePosted = "";

            if (obj[i].description != null)
                mp.description = obj[i].description.toString();
            else mp.description = "";

            if (obj[i].firstName != null)
                mp.firstName = obj[i].firstName.toString();
            else mp.firstName = "";

            if (obj[i].memberID != null)
                mp.memberID = obj[i].memberID; //await this.common.encryptString(obj[i].memberID.toString());//obj[i].MemberID.toString();
            else mp.memberID = "";

            if (obj[i].memberName != null)
                mp.memberName = obj[i].memberName.toString();
            else mp.memberName = "";

            if (obj[i].postID != null)
                mp.postID = obj[i].postID.toString();
            else mp.postID = "";

            this.requestQuery = `${this.MEMBERS_SERVICE_URI}getRecentPostResponses/${mp.postID}`;
            //this.httpOptions.headers.append("authorization","Bearer " + this.accessToken);
            let responseData = await this.httpClient.get(this.requestQuery,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'authorization': 'Bearer ' + localStorage.getItem("access_token")
                    }
                }).toPromise();
            //let responseData = await this.httpClient.get(this.requestQuery).toPromise();
            responseData = Array.of(responseData);
            let objC = responseData[0];
            let lstChild = new Array<RecentPostChildModel>();

            for (var j = 0; j < objC.length; j++) {

                let mp2 = new RecentPostChildModel();

                if (objC[j].picturePath != null)
                    mp2.picturePath = objC[j].picturePath.toString();
                else mp2.picturePath = "";

                if (objC[j].dateResponded != null)
                    mp2.dateResponded = objC[j].dateResponded.toString();
                else mp2.dateResponded = "";

                if (objC[j].description != null)
                    mp2.description = objC[j].description.toString();
                else mp2.description = "";

                if (objC[j].firstName != null)
                    mp2.firstName = objC[j].firstName.toString();
                else mp2.firstName = "";

                if (objC[j].memberID != null)
                    mp2.memberID = objC[j].memberID; //await this.common.encryptString(objC[j].memberID.toString());
                else mp2.memberID = "";

                if (objC[j].memberName != null)
                    mp2.memberName = objC[j].memberName.toString();
                else mp2.memberName = "";

                if (objC[j].postID != null)
                    mp2.postID = objC[j].postID.toString();
                else mp2.postID = "";

                if (objC[j].postResponseID != null)
                    mp2.postResponseID = objC[j].postResponseID.toString();
                else mp2.postResponseID = "";

                lstChild.push(mp2);
            }
            mp.children = lstChild;
            lst.push(mp);
        }
        return lst;
    }

    async doPost(memberID: string, txt: string, postID: string) {

        let postBody: PostModel = {
            memberID: memberID,
            postID: postID,
            postMsg: txt
        }

        this.requestQuery = `${this.MEMBERS_SERVICE_URI}SavePosts/${memberID}/${postID}?postMsg=${txt}`;

        //let response = await this.httpClient.post(this.requestQuery,null ,{ responseType: 'text' }).toPromise();
        // let body = JSON.stringify(postBody);
        // let response = await this.httpClient.put(this.requestQuery, body,
        //     {
        //         headers: {
        //             'Content-Type': 'application/json; charset=utf-8',
        //             'authorization': 'Bearer ' + localStorage.getItem("access_token")
        //         }, responseType: 'text'
        //     }).toPromise();


        //this.requestQuery = `${this.MEMBERS_SERVICE_URI}SaveMemberGeneralInfo/${memberID}`;
        //let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();

        return response.toString();
    }

    async SendAdvertismentInfo(firstName: string, lastName: string,
        company: string, email: string, phone: string, countryVal: string, title: string) {
        var url = `${this.MEMBERS_SERVICE_URI}SendAdvertisementInfo?FirstName=${firstName}&LastName=${lastName}&Company=${company}
                &Email=${email}&Phone=${phone}&Country=${countryVal}&Title=${title}`;
        let request = await this.httpClient.get(url, { responseType: 'text' }).toPromise();
    }

    async ResetPassword(email: string) {
        var url = `${this.MEMBERS_SERVICE_URI}ResetPassword?email=${email}`;

        let response = await this.httpClient.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }).toPromise();
    }

    async isResetCodeExpired(code: string) {
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

    async changePassword(pwd: string, email: string, code: string) {
        var url = `${this.MEMBERS_SERVICE_URI}ChangePassword?pwd=${pwd}&email=${email}&code=${code}`;
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

    async registerUser(firstName: string, lastName: string, email: string, passWord: string,
        gender: string, month: string, day: string, year: string) {
        var url = `${this.MEMBERS_SERVICE_URI}RegisterUserToLG?fName=${firstName}&lName=${lastName}&email=${email}&pwd=${passWord}&day=${day}&month=${month}&year=${year}&gender=${gender}`;
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

    async validateNewRegisteredUser(email: string, code: string) {
        var url = `${this.MEMBERS_SERVICE_URI}ValidateNewRegisteredUser?email=${email}&code=${code}`;
        let response = await this.httpClient.get<Array<RegisteredUser>>(url,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return response;
    }

    async getMemberBasicInfo(memberID: string) {

        let lst = new Array<MemberProfileBasicInfoModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetMemberGeneralInfoV2/${memberID}`;
        let responseData = await this.httpClient.get<MemberProfileBasicInfoModel>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;

    }

    async getIndustries(sector: string) {

        let lst = new Array<string>();
        this.requestQuery = `${this.ORGANIZATIONS_SERVICE_URI}GetIndustries?sector=${sector}`;
        let responseData = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        responseData = Array.of(responseData);

        let obj = responseData[0];
        for (var i = 0; i < obj.length; i++) {
            lst.push(obj[i]);
        }
        return lst;
    }


    async getMemberContactInfo(memberID: string) {

        let lst = new Array<MemberProfileContactInfoModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetMemberContactInfo/${memberID}`;
        let responseData = await this.httpClient.get<MemberProfileContactInfoModel>(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
        return responseData;
    }

    async getMemberEducationInfo(memberID: string) {
        let lst = new Array<MemberProfileEducationModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetMemberEducationInfo/${memberID}`;
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

            let mp = new MemberProfileEducationModel();

            if (obj[i]["schoolID"] != null)
                mp.schoolID = obj[i]["schoolID"].toString();
            else mp.schoolID = "";

            if (obj[i]["schoolName"] != null)
                mp.schoolName = obj[i]["schoolName"].toString();
            else mp.schoolName = "";

            if (obj[i]["schoolAddress"] != null)
                mp.schoolAddress = obj[i]["schoolAddress"].toString();
            else mp.schoolAddress = "";

            if (obj[i]["degree"] != null)
                mp.degree = obj[i]["degree"].toString();
            else mp.degree = "";

            if (obj[i]["degreeTypeID"] != null)
                mp.degreeTypeID = obj[i]["degreeTypeID"].toString();
            else mp.degreeTypeID = "";

            if (obj[i]["major"] != null)
                mp.major = obj[i]["major"].toString();
            else mp.major = "";


            if (obj[i]["schoolImage"] != null)
                mp.webSite = obj[i]["schoolImage"].toString();
            else mp.webSite = "";

            if (mp.webSite.indexOf('http') == -1) {
                mp.webSite = "http://" + mp.webSite;
            }

            if (obj[i]["schoolImage"] != null) {
                if (obj[i]["schoolImage"] != "")
                    mp.schoolImage = "https://www.google.com/s2/favicons?domain=" + obj[i]["schoolImage"].toString();
                else mp.schoolImage = "http://www.marcman.xyz/assets/images/members/default.png";
            }
            if (obj[i]["yearClass"] != null)
                mp.yearClass = obj[i]["yearClass"].toString();
            else mp.yearClass = "";

            if (obj[i]["schoolType"] != null)
                mp.schoolType = obj[i]["schoolType"].toString();
            else mp.schoolType = "";

            if (obj[i]["societies"] != null)
                mp.Societies = obj[i]["societies"].toString();
            else mp.Societies = "";

            if (obj[i]["sportLevelType"] != null)
                mp.sportLevelType = obj[i]["sportLevelType"].toString();
            else mp.sportLevelType = "";

            lst.push(mp);
        }
        return lst;
    }

    async getMemberEmploymentInfo(memberID: string) {
        let lst = new Array<MemberProfileEmploymentModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetMemberEmploymentInfo/${memberID}`;
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

            let mp = new MemberProfileEmploymentModel();

            if (obj[i]["companyID"] != null)
                mp.companyID = obj[i]["companyID"].toString();
            else mp.companyID = "";

            if (obj[i]["companyName"] != null)
                mp.companyName = obj[i]["companyName"].toString();
            else mp.companyName = "";

            if (obj[i]["title"] != null)
                mp.title = obj[i]["title"].toString();
            else mp.title = "";

            let city = "";
            let state = "";
            let Address = "";

            if (obj[i]["city"] != null)
                city = obj[i]["city"].toString();

            if (obj[i]["state"] != null)
                state = obj[i]["state"].toString();

            if (city != "")
                Address = city;
            if (Address != "")
                Address = Address + ", " + state;
            else
                Address = state;

            mp.companyAddress = Address;

            if (obj[i]["companyImage"] != null) {
                if (obj[i]["companyImage"] != "")
                    mp.companyImage = "https://www.google.com/s2/favicons?domain=" + obj[i]["companyImage"].toString();
                else mp.companyImage = "http://www.marcman.xyz/assets/images/members/default.png";
            }

            if (obj[i]["website"] != null) {
                //var str = /http/gi;
                if (obj[i]["website"].toString().search("http") == -1)
                    mp.website = "http://" + obj[i]["website"].toString();
                else
                    mp.website = obj[i]["website"].toString();
            }
            else
                mp.website = "";

            let startMonth = ""; let startYear = ""; let endMonth = ""; let endYear = "";

            if (obj[i]["startMonth"] != null)
                startMonth = obj[i]["startMonth"].toString();
            if (obj[i]["startYear"] != null)
                startYear = obj[i]["startYear"].toString();
            if (obj[i]["endMonth"] != null)
                endMonth = obj[i]["endMonth"].toString();
            if (obj[i]["endYear"] != null)
                endYear = obj[i]["endYear"].toString();

            let workedDT = "";
            if (endYear == "Pres")
                workedDT = "Date: " + startMonth + "/" + startYear + " - Present";
            else
                workedDT = "Date: " + startMonth + "/" + startYear + " - " + endMonth + "/" + endYear;

            mp.datesWorked = workedDT;

            if (obj[i]["description"] != null)
                mp.Description = obj[i]["description"].toString();
            else mp.Description = "";

            if (obj[i]["jobDesc"] != null)
                mp.JobDesc = obj[i]["jobDesc"].toString();
            else mp.JobDesc = "";

            if (obj[i]["email"] != null)
                mp.Email = obj[i]["email"].toString();
            else mp.Email = "";

            if (obj[i]["industry"] != null)
                mp.Industry = obj[i]["industry"].toString();
            else mp.Industry = "";

            if (obj[i]["ipoYear"] != null)
                mp.IPOYear = obj[i]["ipoYear"].toString();
            else mp.IPOYear = "";

            if (obj[i]["sector"] != null)
                mp.Sector = obj[i]["sector"].toString();
            else mp.Sector = "";

            if (obj[i]["summaryQuote"] != null)
                mp.summaryQuote = obj[i]["summaryQuote"].toString();
            else mp.summaryQuote = "";

            if (obj[i]["symbol"] != null)
                mp.Symbol = obj[i]["symbol"].toString();
            else mp.Symbol = "";

            if (obj[i]["empInfoID"] != null)
                mp.EmpInfoID = obj[i]["empInfoID"].toString();
            else mp.EmpInfoID = "";

            if (obj[i]["city"] != null)
                mp.City = obj[i]["city"].toString();
            else mp.City = "";

            if (obj[i]["state"] != null)
                mp.State = obj[i]["state"].toString();
            else mp.State = "";

            if (obj[i]["startMonth"] != null)
                mp.StartMonth = obj[i]["startMonth"].toString();
            else mp.StartMonth = "";

            if (obj[i]["startYear"] != null)
                mp.StartYear = obj[i]["startYear"].toString();
            else mp.StartYear = "";

            if (obj[i]["endMonth"] != null)
                mp.EndMonth = obj[i]["endMonth"].toString();
            else mp.EndMonth = "";

            if (obj[i]["endYear"] != null)
                mp.EndYear = obj[i]["endYear"].toString();
            else mp.EndYear = "";

            if (obj[i]["currentlyWorkedHere"] != null)
                mp.CurrentlyWorkedHere = obj[i]["currentlyWorkedHere"].toString();
            else mp.CurrentlyWorkedHere = "";

            lst.push(mp);
        }
        return lst;
    }

    async getAboutMeInfo(memberID: string) {

        let lst = new Array<MemberProfileAboutModel>();
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetMemberPersonalInfo/${memberID}`;
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

            let mp = new MemberProfileAboutModel();

            if (obj[i].aboutMe != null)
                mp.aboutMe = obj[i].aboutMe.toString();
            else mp.aboutMe = "";

            if (obj[i].activities != null)
                mp.activities = obj[i].activities.toString();
            else mp.activities = "";

            if (obj[i].interests != null)
                mp.interests = obj[i].interests.toString();
            else mp.interests = "";

            if (obj[i].specialSkills != null)
                mp.specialSkills = obj[i].specialSkills.toString();
            else mp.specialSkills = "";

            lst.push(mp);
        }
        return lst;
    }

    async SaveMemberGeneralInfo(memberID: string, body: MemberProfileBasicInfoModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}SaveMemberGeneralInfo/${memberID}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async SaveMemberContactInfo(memberID: string, body: MemberProfileContactInfoModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}SaveMemberContactInfo/${memberID}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async SaveMemberAboutInfo(memberID: string, aboutMe: string, activities: string, hobbies: string, specialSkills: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}SaveMemberPersonalInfo?memberID=${memberID}&aboutMe=${aboutMe}&activities=${activities}&interests=${hobbies}&specialSkills=${specialSkills}`;
        let response = await this.httpClient.post(this.requestQuery, null,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async AddNewSchool(memberId: string, body: MemberProfileEducationModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}AddMemberSchool/${memberId}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async UpdateSchool(memberId: string, body: MemberProfileEducationModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}UpdateMemberSchool/${memberId}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.put(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async RemoveSchool(memberId: string, instId: string, instType: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}RemoveMemberSchool?memberID=${memberId}&instID=${instId}&instType=${instType}`;
        let response = await this.httpClient.delete(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async AddWorkExperience(memberId: string, body: MemberProfileEmploymentModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}AddWorkExperience/${memberId}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.post(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async UpdateWorkExperience(memberId: string, body: MemberProfileEmploymentModel) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}UpdateMemberWorkExperience/${memberId}`;
        let requestData = JSON.stringify(body);
        let response = await this.httpClient.put(this.requestQuery, requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async RemoveWorkExperience(memberId: string, empInfoId: string, compId: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}RemoveMemberWorkExperience?empInfoID=${empInfoId}&memberID=${memberId}&compID=${compId}`;
        let response = await this.httpClient.delete(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }
        ).toPromise();
    }

    async UploadProfilePhoto(memberId: string, file: File) {
        const fd = new FormData();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        fd.append('image', file);
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}UploadProfilePhoto/${memberId}`;
        var response = await this.httpClient.post(this.requestQuery, fd,
            {
                headers: {
                    // 'Content-Type': 'text/plain; charset=utf-8',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }

        ).toPromise();
    }

    async IsFriendByContactID(memberID: string, contactID: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}IsFriendByContactID/${memberID}/${contactID}`;
        let response = await this.httpClient.get(this.requestQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }, responseType: 'text'
            }
        ).toPromise();
        return response.toString();
    }

    async getVideoPlayList(memberID: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetVideoPlayList/${memberID}`;
        let response = await this.httpClient.get<Array<YoutubePlayListModel>>(this.requestQuery
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }).toPromise();
        return response;
    }

    async getVideosList(playerListID: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetVideosList/${playerListID}`;
        let response = await this.httpClient.get<Array<YoutubeVideosListModel>>(this.requestQuery
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }).toPromise();
        return response;
    }

    async getChannelId(memberID: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetYoutubeChannel/${memberID}`;
        let response = await this.httpClient.get(this.requestQuery
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                },
                responseType: 'text'
            }).toPromise();
        if (response == null)
            return "";
        else
            return response.toString();
    }

    async saveChannelID(memberID: string, channelID: string) {

        let postBody: YoutubeDataModel = {
            memberID: memberID,
            channelID: channelID
        }
        let requestData = JSON.stringify(postBody);
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}SetYoutubeChannel`;
        let response = await this.httpClient.put(this.requestQuery, requestData
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }).toPromise();
    }

    async getInstagramAccessToken(code: string) {
        this.requestQuery = `${this.MEMBERS_SERVICE_URI}GetInstagramAccessToken?code=${code}`;
        let response = await this.httpClient.get<Array<InstagramUserModel>>(this.requestQuery
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("access_token")
                }
            }).toPromise();
            console.log(response);
        return response;
        
     
    }


    // get Instagram user details and token
   instagramGetUserDetails(code) {
    try {
      const body = new HttpParams()
        .set('client_id', '315611252948079')
        .set('client_secret', 'f65cdcabd35a5eaebf2fc266003aba81')
        .set('grant_type', 'authorization_code')
        .set('redirect_uri', 'https://sportprofiles.net/sp/members/show-profile')
        .set('code', code)
        .set('auth', 'no-auth');
  console.log(body);
      return this.httpClient.post('https://api.instagram.com/oauth/access_token', body.toString(), {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .pipe(
          tap(res => {
            // ----------->>>>>>   you get the token here   <<<<<---------------
            console.log(res)
          }),
          catchError(this.handleError<any>('instagram_auth'))
        );
     } catch (err) {
         console.log(err);
      return err;
     }
   }
  
  // Handle error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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

export class PostModel {
    memberID: String;
    postID: String;
    postMsg: String;
}

export class YoutubeDataModel {
    memberID: string;
    channelID: string;
}

export class IgRequestModel {
    client_id: string;
    client_secret: string;
    grant_type: String;
    redirect_uri:string;
    code:string;
}


