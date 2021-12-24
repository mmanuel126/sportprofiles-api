import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberProfileContactInfoModel } from '../../models/members/profile-contact-info.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/data/members.service';
import { IOrganizationsService } from '../../services/data/organizations.service';
import { SessionMgtService } from '../../services/session-mgt.service';

@Component({
    selector: 'contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {

    public show: boolean = false;
    public showErrMsg: boolean = false;
    public isSaving = false;
    public isSuccess = false;

    public constructor(public session: SessionMgtService, private route: ActivatedRoute, private router: Router,
        private membersSvc: MembersService, private orgSvc: IOrganizationsService) {
    }

    memberID: string;
    contactInfoModel: MemberProfileContactInfoModel;

    ngOnInit() {
        this.memberID = this.session.getSessionVal('userID');
        this.getContactInfo(this.memberID);
    }

    async getContactInfo(memberId: string) {
        this.contactInfoModel = await this.membersSvc.getMemberContactInfo(memberId);
    }

    async saveContactInfo(contactInfoForm: NgForm) {
        this.isSuccess = false;
        this.isSaving = true;
        await this.membersSvc.SaveMemberContactInfo(this.memberID, this.contactInfoModel);
        this.isSaving = false;
        this.isSuccess = true;
    }
}
