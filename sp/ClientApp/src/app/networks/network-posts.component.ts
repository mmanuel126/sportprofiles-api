import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NetworksService } from '../services/data/networks.service';
import { SessionMgtService } from '../services/session-mgt.service';
import { NetworkInfoModel, NetworkPostsModel, CategoryModel, CategoryTypeModel, NetworkTopicsModel } from '../models/networks/network-info-model';
import { MemberEventsModel } from '../models/events/member-events-model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ICommonService } from '../services/common.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'network-posts',
  templateUrl: './network-posts.component.html',
  styleUrls: ['./network-posts.component.css'],
})
export class NetworkPostsComponent implements OnInit {

  //basic info variables  
  networkID: string;
  public show: boolean = false;
  postID: string;
  memberID: string;
  p: number = 1;
  memberImageUrlpath: string = environment.memberImagesUrlPath;
  networkPosts: NetworkPostsModel[];

  postModel: PostModel = {
    postText: "",
  }

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
    this.getNetworkPosts();
  }

  ngOnDestroy() {
  }


  async getNetworkPosts() {
    this.networkPosts = await this.networkSvrc.getNetworkPosts(this.networkID);
  }

  doShowProfile(memberId: string) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: memberId } });
    return false;
  }

  async refreshPosts() {
    this.show = true;
    await this.getNetworkPosts();
    this.show = false;
    return false;
  }

  async showMemberProfile(id: string) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: id } });
    return false;
  }

  jumpToComment(postID: string, commentModal) {
    this.postID = postID;
    this.modHand = this.modalService.open(commentModal);
    return false;
  }

  async doPost(frm) {
    this.show = true;
    await this.networkSvrc.doPost(this.networkID, this.memberID, this.postModel.postText, "0");
    this.modHand.close();
    await this.getNetworkPosts();
    this.show = false;
    this.postModel.postText = "";
    return false;
  }

  async doPostReply(commentModal) {
    this.show = true;
    await this.networkSvrc.doPost(this.networkID, this.memberID, this.postModel.postText, this.postID);
    this.modHand.close();
    await this.getNetworkPosts();
    this.show = false;
    this.postModel.postText = "";
    return false;
  }
}

export class PostModel {
  postText: string;
}
