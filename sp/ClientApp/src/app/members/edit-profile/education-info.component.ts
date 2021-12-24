import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/data/members.service';
import { ICommonService } from '../../services/common.service';
import { SessionMgtService } from '../../services/session-mgt.service';
import { MemberProfileEducationModel } from 'src/app/models/members/profile-education.model';
import { SchoolsByStateModel } from 'src/app/models/organization/schools-by-state.model';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'education-info',
    templateUrl: './education-info.component.html',
    styleUrls: ['./education-info.component.css']
})
export class EducationInfoComponent implements OnInit {

    public show: boolean = false;
    public showErrMsg: boolean = false;
    public isSaving = false;
    public noSchools: boolean = false;
    schoolsList: SchoolsByStateModel[];
    schoolName: string;
    schoolID: string;
    schoolType: string;

    modHand: NgbModalRef;

    eduInfoEdit: MemberProfileEducationModel = {
        schoolID: "",
        schoolImage: "",
        Societies: "",
        schoolAddress: "select",
        schoolName: "",
        schoolType: "3",
        webSite: "",
        major: "", degree: "select", yearClass: "select",
        degreeTypeID: "",
        sportLevelType: ""
    }

    eduInfo: MemberProfileEducationModel = {
        schoolID: "",
        schoolImage: "",
        Societies: "",
        schoolAddress: "select",
        schoolName: "",
        schoolType: "3",
        webSite: "",
        major: "", degree: "select", yearClass: "select", degreeTypeID: "",
        sportLevelType: ""
    }

    public constructor(public session: SessionMgtService, private route: ActivatedRoute, private router: Router,
        private membersSvc: MembersService, private comSvc: ICommonService,
        public modalService: NgbModal) {
    }

    memberID: string;
    educationInfoModel: MemberProfileEducationModel[];

    ngOnInit() {
        this.memberID = this.session.getSessionVal('userID');
        this.getEducationInfo();
    }

    async getEducationInfo() {
        this.educationInfoModel = await this.membersSvc.getMemberEducationInfo(this.memberID.toString());
        if (this.educationInfoModel.length == 0) {
            this.noSchools = true;
        }
        else { this.noSchools = false }
    }

    jumpToAddSchool(modal) {
        this.modHand = this.modalService.open(modal);
        return false;
    }

    jumpToEditSchool(editModal, id: string, name: string, major: string, degree: string, classYear: string) {
        this.schoolName = name;
        this.eduInfoEdit.degree = degree;
        this.eduInfoEdit.major = major;
        this.eduInfoEdit.yearClass = classYear;
        this.eduInfoEdit.schoolID = id;
        this.modHand = this.modalService.open(editModal);
        return false;
    }

    jumpToRemoveSchool(removeModal, id: string, type: string, name: string) {
        this.schoolName = name;
        this.schoolID = id;
        this.schoolType = type;
        this.modHand = this.modalService.open(removeModal);
        return false;
    }

    async onStateChange(state: string) {
        this.schoolsList = await this.comSvc.getSchoolsByState(state, this.eduInfo.schoolType);
    }

    async doAddNewSchool(form) {
        this.isSaving = true;
        await this.membersSvc.AddNewSchool(this.memberID, this.eduInfo);
        this.getEducationInfo();
        this.isSaving = false;
        this.modalService.dismissAll(form);
    }

    async doUpdateSchool() {
        this.isSaving = true;
        await this.membersSvc.UpdateSchool(this.memberID, this.eduInfoEdit);
        this.getEducationInfo();
        this.isSaving = false;
        //this.modalService.dismissAll(form);
    }

    async doRemoveSchool() {
        this.isSaving = true;
        await this.membersSvc.RemoveSchool(this.memberID, this.schoolID, this.schoolType);
        this.getEducationInfo();
        this.isSaving = false;
        //this.modalService.dismissAll(form);
    }

    goToLink(url: string) {
        window.open(url + '/', '_blank');
        return false;
    }
}
