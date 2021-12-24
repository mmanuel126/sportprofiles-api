import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionMgtService } from '../services/session-mgt.service';
import { INetworksService } from '../services/data/networks.service';
import { NetworkSettingsModel } from '../models/networks/network-info-model';

@Component({
    selector: 'network-settings',
    templateUrl: './network-settings.component.html',
    styleUrls: ['./network-settings.component.css']
})
export class NetworkSettingComponent implements OnInit {

    public show: boolean = false;
    public showErrMsg: boolean = false;
    public isSaving :boolean = false;
    public isNetworkSuccess: boolean = false;

    nsModelList = new Array<NetworkSettingsModel>();
    nsModel = new NetworkSettingsModel();

    public constructor(public session: SessionMgtService, public netSetSvc: INetworksService,
        public route: ActivatedRoute) {
    }

    memberID: string;
    networkID:string;

    ngOnInit() {
        this.networkID = this.route.snapshot.queryParamMap.get('networkID');
        this.memberID = this.session.getSessionVal('userID');
        this.getNetworkSettings();
    }

    async getNetworkSettings() {
        this.nsModelList = await this.netSetSvc.getNetworkSettings(this.networkID);
        this.nsModel = this.nsModelList[0];
    }

    async saveNetworkSettings() {
        this.isSaving = true;
        this.isNetworkSuccess = false;
        await this.netSetSvc.saveNetworkSettings(this.memberID, this.nsModel);
        this.isSaving = false;
        this.isNetworkSuccess = true;
    }

}
