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
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.css'],
})
export class NetworkInfoComponent implements OnInit {

  spinner: boolean;
  public isSaving = false;

  //basic info variables  
  networkID: string;
  netImage: string;
  netName: string;
  netDesc: string;
  public show: boolean = false;
  postID: string;
  memberID: string;

  topicCnt: Number = 0;
  topicPostCnt: Number = 0;
  topicName: string = "";
  topicID: string;
  topicPostID: string;

  p: number = 1;
  networkImageUrlpath: string = environment.networkImagesUrlPath;
  memberImageUrlpath: string = environment.memberImagesUrlPath;
  eventImageUrlpath: string = environment.eventImageUrlpath;

  public basicInfo: NetworkInfoModel[];
  networkPosts: NetworkPostsModel[];
  networkTopics: NetworkTopicsModel[];
  topicPosts: NetworkPostsModel[];
  memCount: string;
  categoryList: CategoryModel[];
  categoryTypeList: CategoryTypeModel[];

  postModel: PostModel = {
    postText: "",
  }

  newTopicModel: NetTopicModel = {
    topicName: "",
    postText: ""
  }

  netInfoModel: NetworkInfoModel = {
    networkID: this.route.snapshot.queryParamMap.get('networkID'),
    networkName: "",
    networkDesc: "",
    categoryID: "select",
    categoryTypeID: "select",
    recentNews: "",
    networkImage: "",
    networkOwner: "",
    memberCount: "",
    createdDate: "",
    office: "", webSite: "", email: "", street: "", city: "", state: "", IsAlreadyMemberID: "",
    zip: "", inActive: "", categoryDesc: "", categoryTypeDesc: "", access: "",

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
    this.getNetworkBasicInfo();
    this.getNetworkPosts();
    this.getNetworkTopics();
    this.getNetworkEvents();
  }

  ngOnDestroy() {
  }

  getData(catID: string, catTypeID: string) {
    this.getCategoryList();
    // console.log(this.categoryList);
    this.netInfoModel.categoryID = catID;
    this.getCategoryTypeList(catID);
    this.netInfoModel.categoryTypeID = catTypeID;
  }

  onTabChange($event: any) {
    let tab = $event.index;
    if (tab == 0) {

    }
  }

  async getNetworkBasicInfo() {
    this.basicInfo = await this.networkSvrc.getNetworkBasicInfo(this.networkID);
    this.netImage = this.basicInfo[0].networkImage;
    this.netName = this.basicInfo[0].networkName;
    this.netDesc = this.basicInfo[0].networkDesc;
  }

  async getNetworkPosts() {
    this.networkPosts = await this.networkSvrc.getNetworkPosts(this.networkID);
  }

  jumpToEditInfo(editModal, name: string, desc: string, catID: string, catTypeID: string, recentNews: string) {
    this.netInfoModel.networkName = name;
    this.netInfoModel.networkDesc = desc;
    this.netInfoModel.recentNews = recentNews;
    this.modHand = this.modalService.open(editModal);
    return false;
  }

  onCategoryChange(val: any) {

  }

  async getCategoryList() {
    this.categoryList = await this.networkSvrc.getCategoryList();
  }

  async getCategoryTypeList(catID: any) {
    this.categoryTypeList = await this.networkSvrc.getCategoryTypeList(catID);
  }

  async getNetworkTopics() {
    this.networkTopics = await this.networkSvrc.getNetworkTopics(this.networkID);
    this.topicCnt = this.networkTopics.length;
  }

  async doUpdateNetwork() {
    this.isSaving = true;
    await this.networkSvrc.updateNetworkInfo(this.netInfoModel)
    this.isSaving = false;
    this.netName = this.netInfoModel.networkName;
    this.netDesc = this.netInfoModel.networkDesc;
    this.basicInfo[0].networkName = this.netInfoModel.networkName;
    this.basicInfo[0].networkDesc = this.netInfoModel.networkDesc;
    this.basicInfo[0].recentNews = this.netInfoModel.recentNews;
    this.modHand.close();
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

  pEvent: number = 1;
  pTopic: number = 1;
  eventCnt: Number = 0;
  networkEvents: MemberEventsModel[];
  async getNetworkEvents() {
    this.networkEvents = await this.networkSvrc.getNetworkEvents(this.networkID, this.memberID);
    this.eventCnt = this.networkEvents.length;
  }

  createNewEvent(eventModal) {

  }

  viewEventInfo() {

  }

  jumpToDeleteEvent() {

  }

  jumpToChangeRSVP() {

  }

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