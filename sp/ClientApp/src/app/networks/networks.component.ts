import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SessionMgtService } from '../services/session-mgt.service';
import { NetworksService } from '../services/data/networks.service';
import { NetworkInfoModel } from '../models/networks/network-info-model';
import { of as observableOf, throwError, Subject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Pipe, PipeTransform, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { catchError, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, format: any): any {
     return super.transform(value, format);
  }
}

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent implements OnInit {

  public memberId: string;
  public networkCnt: number = 0;
  public networkList: NetworkInfoModel[];
  public spinner: boolean = false;
  public networkId = "";

  showErrMsg: boolean = false;
  errMsg: string;

  modHand: NgbModalRef;

  searchModel = new SearchModel();
  autoCompleteModel = new AutoCompleteModel();

  public networks: Observable<any[]>;
  public networksAuto: Observable<any[]>;

  private searchNetworks = new Subject<string>();
  public networkName = '';
  public flag: boolean = true;
  public networkImagesUrlPath: string;

  constructor(private session: SessionMgtService, 
    public _dateFormatPipe:DatePipe, public networkSvc: NetworksService, public ngbMod: NgbModal,
    public router: Router) { 
    this.networkImagesUrlPath = environment.networkImagesUrlPath;
    console.log(this.networkImagesUrlPath);
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getMyNetworks(this.memberId);

    this.autoCompleteModel = new AutoCompleteModel();
    let networks = this.searchNetworks.pipe(
      debounceTime(300),        // wait for 300ms pause in events  
      distinctUntilChanged(),   // ignore if next search term is same as previous  
      switchMap(term => term   // switch to new observable each time  
        // return the http search observable  
        ? this.networkSvc.getNetworkResults(term)
        // or the observable of empty heroes if no search term  
        : observableOf<any[]>([])),
      catchError(error => {
        // TODO: real error handling  
        console.log(error);
        return observableOf<any[]>([]);
      })); 
      this.networksAuto = networks;
  }

  async getMyNetworks(memberID: string) 
  {
    this.networkList = await this.networkSvc.getMyNetworksList(memberID);
    if (this.networkList != null) {
      this.networkCnt = this.networkList.length;
    }
  }

  doSearch() {
    this.getSearchConnections(this.memberId, this.searchModel.key);
  }

  async getSearchConnections(memberID: string, searchKey: string) {
    this.spinner = true;
    this.spinner = false;
  }

  // Push a search term into the observable stream.  
  searchNetwork(name: string): void {
    this.flag = true;
    this.searchNetworks.next(this.autoCompleteModel.name);
  }


  onselectNetwork(name, id) {
    this.flag = false;
    this.router.navigate(['networks/network-info'], { queryParams: { networkID: id } });
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
