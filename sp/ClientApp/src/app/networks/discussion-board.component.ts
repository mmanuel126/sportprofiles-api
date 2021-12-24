import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";
import { NetworksService } from '../services/data/networks.service';
import { SessionMgtService } from '../services/session-mgt.service';
import { RecentPostsModel } from '../models/recent-posts.model';
import { ContactModel } from '../models/contacts/contact-model';
import { NetworkInfoModel, NetworkPostsModel, CategoryModel, CategoryTypeModel, NetworkTopicsModel } from '../models/networks/network-info-model';
import { MemberEventsModel } from '../models/events/member-events-model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ICommonService } from '../services/common.service';
//import { ISettingsService } from 'src/app/services/data/settings.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'discussion-board',
  templateUrl: './discussion-board.component.html',
  styleUrls: ['./discussion-board.component.css'],
})
export class DiscussionBoardComponent implements OnInit {

  spinner: boolean;
  public isSaving = false;

  //basic info variables  
  networkID: string;
  public show: boolean = false;
  postID: string;
  memberID: string;

  topicCnt: Number = 0;
  topicPostCnt: Number = 0;
  topicName: string = "";
  topicID: string;
  topicPostID: string;

  p: number = 1;
  memberImageUrlpath: string = environment.memberImagesUrlPath;
  networkPosts: NetworkPostsModel[];
  networkTopics: NetworkTopicsModel[];
  topicPosts: NetworkPostsModel[];
  memCount: string;

  postModel: PostModel = {
    postText: "",
  }

  newTopicModel: NetTopicModel = {
    topicName: "",
    postText: ""
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
    this.getNetworkTopics();
  }

  ngOnDestroy() {
  }

  onTabChange($event: any) {
    let tab = $event.index;
    if (tab == 0) {

    }
  }

  async getNetworkPosts() {
    this.networkPosts = await this.networkSvrc.getNetworkPosts(this.networkID);
  }

  async getNetworkTopics() {
    this.networkTopics = await this.networkSvrc.getNetworkTopics(this.networkID);
    this.topicCnt = this.networkTopics.length;
  }

  createNewTopic(modal) {
    this.modHand = this.modalService.open(modal);
    return false;
  }

  viewDiscTopic(viewTopicModal, topicID, topicDesc) {
    this.viewDiscussionTopic(viewTopicModal, topicID, topicDesc);
    this.modHand = this.modalService.open(viewTopicModal);
    return false;
  }

  async viewDiscussionTopic(viewTopicModal, topicID, topicDesc) {
    this.topicPosts = await this.networkSvrc.getTopicPosts(topicID);
    this.topicPostCnt = this.networkTopics.length;
    this.topicName = topicDesc;
    this.topicID = topicID;

    return false;
  }

  newTopicPostModal(modal) {
    this.modHand = this.modalService.open(modal);
    return false;
  }

  replyTopicPostModal(postID, modal) {
    this.topicPostID = postID;
    this.modHand = this.modalService.open(modal);
    return false;
  }

  async doNetTopicPost(frm) {
    this.show = true;
    await this.networkSvrc.doNetTopicPost(this.memberID, this.topicID, this.postModel.postText);
    this.modHand.close();
    await this.viewDiscussionTopic(null, this.topicID, this.topicName);
    this.show = false;
    this.postModel.postText = "";
    return false;
  }

  async doNetTopicPostReply(commentModal) {
    this.show = true;
    await this.networkSvrc.doNetTopicPost(this.memberID, this.topicID, this.postModel.postText);
    this.modHand.close();
    await this.viewDiscussionTopic(null, this.topicID, this.topicName);
    this.show = false;
    this.postModel.postText = "";
    return false;
  }

  navigateToMemberProfile(memberID, memberName) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: memberID } });
    this.modHand.close();
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

  async doCreateNewTopic() {
    this.show = true;
    await this.networkSvrc.doCreateTopic(this.networkID, this.memberID, this.newTopicModel.topicName, this.newTopicModel.postText);
    await this.getNetworkTopics();
    this.show = false;
    this.newTopicModel.topicName = "";
    this.newTopicModel.postText = "";
    this.modHand.close();
    return false;
  }

  jumpToDeleteTopic(modal, topicID: string) {
    this.topicID = topicID;
    this.modHand = this.modalService.open(modal);
    return false;
  }

  async deleteNetDiscussionTopic() {
    this.spinner = true;
    await this.networkSvrc.deleteNetDiscTopic(this.topicID);
    await this.networkSvrc.getNetworkTopics(this.networkID);
    this.modHand.close();
    this.spinner = false;
    return false;
  }

  pTopic: number = 1;

}

export class PostModel {
  postText: string;
}

export class ProgressModel {
  labelText: string;
}

export class NetTopicModel {
  topicName: string;
  postText: string
}