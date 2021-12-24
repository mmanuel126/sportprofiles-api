import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { NetworksService } from '../services/data/networks.service';
import { SessionMgtService } from '../services/session-mgt.service';
import { NetworkInfoModel, NetworkPostsModel, CategoryModel, CategoryTypeModel, NetworkTopicsModel } from '../models/networks/network-info-model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ICommonService } from '../services/common.service';

@Component({
  selector: 'network-basic-info',
  templateUrl: './network-basic-info.component.html',
  styleUrls: ['./network-basic-info.component.css'],
})
export class NetworkBasicInfoComponent implements OnInit {

  spinner: boolean;
  public isSaving = false;

  //basic info variables  
  networkID: string;
  netImage: string;
  netName: string;
  netDesc: string;
  public show: boolean = false;
  memberID: string;

  public basicInfo: NetworkInfoModel[];

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
  }

  ngOnDestroy() {
  }

  async getNetworkBasicInfo() {
    this.basicInfo = await this.networkSvrc.getNetworkBasicInfo(this.networkID);
  }

  jumpToEditInfo(editModal, name: string, desc: string, catID: string, catTypeID: string, recentNews: string) {
    this.netInfoModel.networkName = name;
    this.netInfoModel.networkDesc = desc;
    this.netInfoModel.recentNews = recentNews;
    this.modHand = this.modalService.open(editModal);
    return false;
  }

  async doUpdateNetwork() {
    this.isSaving = true;
    await this.networkSvrc.updateNetworkInfo(this.netInfoModel)
    this.isSaving = false;
    location.reload();
  }

}