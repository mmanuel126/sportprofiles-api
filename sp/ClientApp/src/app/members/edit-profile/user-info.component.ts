import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberProfileBasicInfoModel, SportsListModel, MemberProfileBasicInfoSaveModel } from '../../models/members/profile-member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/data/members.service';
import { IOrganizationsService } from '../../services/data/organizations.service';
import { ICommonService } from '../../services/common.service';
import { SessionMgtService } from '../../services/session-mgt.service';

@Component({
    selector: 'user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

    public show: boolean = false;
    public showErrMsg: boolean = false;
    public isSaving = false;
    public isSuccess = false;
    public sector = "";
    public isAthlete = false;

    sportsList = new Array<SportsListModel>();

    basicInfo: MemberProfileBasicInfoModel = {
        picturePath: "",
        memProfileName: "",
        titleDesc: "",
        memProfileStatus: "",
        memProfileGender: "",
        memProfileDOB: "",
        interestedDesc: "",
        memProfileLookingFor: "",
        currentCity: "",
        currentStatus: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",
        firstName: "",
        homeNeighborhood: "",
        hometown: "",
        interestedInType: "",
        joinedDate: "",
        lastName: "",
        lookingForEmployment: false,
        lookingForNetworking: false,
        lookingForPartnership: false,
        lookingForRecruitment: false,
        memberID: "",
        middleName: "",
        politicalView: "",
        religiousView: "",
        sex: "",
        showDOBType: "",
        showSexInProfile: "",
        getLGEntitiesCount: "",
        sport: "",
        leftRightHandFoot: "",
        bio: "",
        height: "",
        weight: "",
        preferredPosition: "",
        secondaryPosition: "",
    }

    public constructor(public session: SessionMgtService, private route: ActivatedRoute, private router: Router,
        private membersSvc: MembersService, private orgSvc: IOrganizationsService, private comSvc: ICommonService) {
    }

    memberID: string;
    basicInfoModel: MemberProfileBasicInfoModel;

    ngOnInit() {
        this.memberID = this.session.getSessionVal('userID');
        this.getBasicInfo(this.memberID);
        this.getSportsList();
    }

    async getBasicInfo(memberId: string) {
        this.basicInfoModel = await this.membersSvc.getMemberBasicInfo(this.memberID.toString());

        if (this.basicInfoModel.currentStatus != "Athlete (Amateur)" && this.basicInfoModel.currentStatus != "Athlete (Professional)") {
            this.isAthlete = false;
        }
        else {
            this.isAthlete = true;
        }
    }

    async getSportsList() {
        this.sportsList = await this.comSvc.getSportsList();
        let x = this.sportsList;
    }

    async getIndustries(sec) {
    }

    onSectorChange(sector) {
    }

    async saveBasicInfo(basicInfoForm: NgForm) {
        this.isSuccess = false;
        this.isSaving = true;
        if (this.basicInfoModel.currentStatus != "Athlete (Amateur)" && this.basicInfoModel.currentStatus != "Athlete (Professional)") {
            this.basicInfoModel.leftRightHandFoot = "";
            this.basicInfoModel.preferredPosition = "";
            this.basicInfoModel.secondaryPosition = "";
            this.basicInfoModel.height = "";
            this.basicInfoModel.weight = "";

        }
        if (this.basicInfoModel.middleName == null)
            this.basicInfoModel.middleName = "";

        await this.membersSvc.SaveMemberGeneralInfo(this.memberID, this.basicInfoModel);
        this.isSaving = false;
        this.isSuccess = true;
    }

    showAthleteAttributes(val: string) {
        if (val != "Athlete (Amateur)" && val != "Athlete (Professional)")
            this.isAthlete = false;
        else
            this.isAthlete = true;
    }
}
