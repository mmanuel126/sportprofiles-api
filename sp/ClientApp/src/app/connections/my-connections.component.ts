//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SessionMgtService } from '../services/session-mgt.service';
import { ConnectionsService } from '../services/data/connections.service';
import { ContactModel } from '../models/contacts/contact-model';
import { throwError, Subject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-my-connections',
  templateUrl: './my-connections.component.html',
  styleUrls: ['./my-connections.component.css']
})
export class MyConnectionsComponent implements OnInit {

  public memberId: string;
  public contactCnt: number = 0;
  public contactInfoList: ContactModel[];
  public spinner: boolean = false;
  public contactId = "";

  showErrMsg: boolean = false;
  errMsg: string;

  modHand: NgbModalRef;

  searchModel = new SearchModel();
  autoCompleteModel = new AutoCompleteModel();

  public connections: Observable<any[]>;
  private searchContacts = new Subject<string>();
  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(private session: SessionMgtService, public contactSvc: ConnectionsService, public ngbMod: NgbModal) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getMyConnections(this.memberId);
  }

  async getMyConnections(memberId: string) {

    this.contactInfoList = await this.contactSvc.getMyConnections(memberId);
    if (this.contactInfoList != null) {
      this.contactCnt = this.contactInfoList.length;
    }
  }

  doSearch() {
    this.getSearchConnections(this.memberId, this.searchModel.key);
  }

  async getSearchConnections(memberID: string, searchKey: string) {
    this.spinner = true;
    if (searchKey == undefined || searchKey == "") {
      this.contactInfoList = await this.contactSvc.getMyConnections(this.memberId);
    }
    else {
      this.contactInfoList = await this.contactSvc.searchMemberConnections(this.memberId, searchKey);
    }
    if (this.contactInfoList != null) {
      this.contactCnt = this.contactInfoList.length;
    }
    this.spinner = false;
  }

  showDropContactPopup(modal, contactID: string, name: string) {
    this.contactId = contactID;
    this.modHand = this.ngbMod.open(modal);
    return false;
  }

  async doRemoveConnection() {
    this.spinner = true;
    await this.contactSvc.deleteConnection(this.memberId, this.contactId);
    this.getMyConnections(this.memberId);
    this.spinner = false;
    this.modHand.close();
    return false;
  }

}

export class SearchModel {
  key: string;
}

export class AutoCompleteModel {
  name: string;
  id: string;
}
