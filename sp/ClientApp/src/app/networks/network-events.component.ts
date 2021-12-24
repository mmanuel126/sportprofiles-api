import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NetworksService } from '../services/data/networks.service';
import { SessionMgtService } from '../services/session-mgt.service';
import { MemberEventsModel } from '../models/events/member-events-model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ICommonService } from '../services/common.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-network-events',
  templateUrl: './network-events.component.html',
  styleUrls: ['./network-events.component.css'],
})
export class NetworkEventsComponent implements OnInit {

  spinner: boolean;
  public isSaving = false;

  //basic info variables  
  networkID: string;
  public show: boolean = false;
  memberID: string;
  eventImageUrlpath: string = environment.eventImageUrlpath;
  memCount: string;
  modHand: NgbModalRef;
  mySubscription: any;

  constructor(public session: SessionMgtService, private route: ActivatedRoute, private router: Router,
    public ngbMod: NgbModal, public modalService: NgbModal,
    public common: ICommonService, public networkSvrc: NetworksService) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {

    this.networkID = this.route.snapshot.queryParamMap.get('networkID');
    this.memberID = this.session.getSessionVal('userID');
    this.getNetworkEvents();
  }

  ngOnDestroy() {
  }

  navigateToMemberProfile(memberID, memberName) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: memberID } });
    this.modHand.close();
    return false;
  }

  doShowProfile(memberId: string) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: memberId } });
    return false;
  }

  async showMemberProfile(id: string) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: id } });
    return false;
  }

  pEvent: number = 1;
  eventCnt: Number = 0;
  networkEvents: MemberEventsModel[];
  //events
  async getNetworkEvents() {
    this.networkEvents = await this.networkSvrc.getNetworkEvents(this.networkID, this.memberID);
    this.eventCnt = this.networkEvents.length;
  }

  createNewEvent() {

  }

  viewEventInfo() {

  }

  jumpToDeleteEvent() {

  }

  jumpToChangeRSVP() {

  }
}
