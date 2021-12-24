//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SessionMgtService } from '../services/session-mgt.service';
import { throwError, Subject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworksService } from '../services/data/networks.service';
import { NetworkMemberModel } from '../models/networks/network-info-model';

@Component({
  selector: 'network-admins',
  templateUrl: './network-admins.component.html',
  styleUrls: ['./network-admins.component.css']
})
export class NetworkAdminsComponent implements OnInit {

  public memberId: string;
  public memberCnt: number = 0;
  public netMemberList: NetworkMemberModel[];
  public spinner: boolean = false;
  public networkID = "";

  modHand: NgbModalRef;

  public connections: Observable<any[]>;
  private searchContacts = new Subject<string>();
  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(private session: SessionMgtService, public netSvc: NetworksService,
    private route: ActivatedRoute,
    public ngbMod: NgbModal) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.networkID = this.route.snapshot.queryParamMap.get('networkID');
    this.getNetworkMembers(this.memberId);
  }

  async getNetworkMembers(memberID: string) {
    this.netMemberList = await this.netSvc.getNetworkAdmins(this.networkID);
    if (this.netMemberList != null) {
      this.memberCnt = this.netMemberList.length;
    }
  }

  addNewAdmin(modal) {
    this.getNonAdminList(this.networkID);
    this.modHand = this.ngbMod.open(modal);
    return false;
  }

  public netNonAdminList: NetworkMemberModel[];

  async getNonAdminList(netID: string) {
    this.netNonAdminList = await this.netSvc.getNetworkAdmins(this.networkID);

    return false;
  }

  AddMemberAsAdmin() {
  }

}

