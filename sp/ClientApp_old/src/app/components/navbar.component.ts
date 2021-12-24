import { of as observableOf, throwError, Subject, Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { catchError, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../services/session-mgt.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { MessagesService } from '../services/data/messages.service'
import { ConnectionsService } from '../services/data/connections.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public webSiteDomain = environment.webSiteDomain;
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  autoCompleteModel = new AutoCompleteModel();
  public flag: boolean = true;
  public entities: Observable<any[]>;
  private searchEntities = new Subject<string>();
  userId: string;
  logoImage: string;
  memberImagesUrlPath: string;
  msgBadgeCnt: string;
  msgCntText: string;

  constructor(
    public stateService: StateService, public session: SessionMgtService, private router: Router, public msgSvc: MessagesService, public contactSvc: ConnectionsService,
    public ngbMod: NgbModal,
    private appService: AppService) {

    this.memberImagesUrlPath = environment.memberImagesUrlPath;
    if (this.session.getSessionVal('userImage') == null) {
      this.session.setSessionVar('userImage', "default.png");
    }
    this.userId = this.session.getSessionVal('userID');
    this.logoImage = environment.appLogo;

    this.getUnReadMessagesCount(this.userId);

  }
  isCollapsed = true;
  isCollapsedPin = false;


  ngOnInit() {
    this.autoCompleteModel = new AutoCompleteModel();
    let entities = this.searchEntities.pipe(
      debounceTime(300),        // wait for 300ms pause in events  
      distinctUntilChanged(),   // ignore if next search term is same as previous  
      switchMap(term => term   // switch to new observable each time  
        // return the http search observable  
        ? this.contactSvc.getSearchList(this.userId, term)
        // or the observable of empty heroes if no search term  
        : observableOf<any[]>([])),
      catchError(error => {
        // TODO: real error handling  
        console.log(error);
        return observableOf<any[]>([]);
      })); this.entities = entities;

  }

  async getUnReadMessagesCount(id: string) {
    this.msgBadgeCnt = await this.msgSvc.getUnReadMessagesCount(id);
    if (this.msgBadgeCnt == "0") {
      this.msgCntText = "You have " + this.msgBadgeCnt + " un-read message!";
    }
    else if (this.msgBadgeCnt != "") {
      this.msgCntText = "You have " + this.msgBadgeCnt + " un-read messages!";
    }
    else {
      this.msgCntText = "";
    }
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
    if (this.isCollapsedPin) {
      this.isCollapsedPin = false;
    }
    else {
      this.isCollapsedPin = true;
    }
  }
  
  toggleSidebar() {
    this.appService.toggleSidebar();
  }

  doShowProfile(memberId: string) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: memberId } });
    return false;
  }

  doLogoff() {
    this.session.setSessionVar('isUserLogin', null);
    this.session.setSessionVar('userID', null);
    this.session.setSessionVar('userEmail', null);
    this.session.setSessionVar('userImage', null);
    this.session.setSessionVar('pwd', null);
    this.router.navigate(['/']);
    return false;
  }

  // Push a search term into the observable stream.  
  searchEntity(name: string): void {
    this.flag = true;
    this.searchEntities.next(this.autoCompleteModel.name);
  }

  onselectEntity(name, id, type) {
    //if (name.length != 0) {  
    // this.autoCompleteModel.name = name;
    this.autoCompleteModel.id = id;
    this.flag = false;
    //}  
    //else {  
    this.session.setSessionVar('memID', id);
    this.autoCompleteModel.name = "";
    if (type = "people") {
      this.router.navigate(['members/show-profile'], { queryParams: { memberID: id } });
    }
    else if (type = "network") {

    }
    else if (type = "event") {

    }

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }

    //location.reload();
    return false;
    // }  
  }

  doSearch() {
    let sTxt = this.autoCompleteModel.name;
    this.autoCompleteModel.name = "";
    this.router.navigate(['contacts/search-results'], { queryParams: { searchText: sTxt } });
    return false;
  }

}

export class AutoCompleteModel {
  name: string;
  id: string;
}
