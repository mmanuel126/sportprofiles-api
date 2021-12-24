import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { SessionMgtService } from './services/session-mgt.service';
import { Router, NavigationStart } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.appName;
  public isUserLogin: string = "";
  public onlineOffline: boolean = navigator.onLine;

  constructor(public session: SessionMgtService, private appService: AppService, private route: Router,
    private titleService: Title) {
    titleService.setTitle(this.title);
    this.isUserLogin = this.session.getSessionVal('isUserLogin');
  }

  ngOnInit() {
    //check to see if internet is working...
    if (this.onlineOffline == false) {
      this.route.navigate(['/errors'], { queryParams: { errType: "http" } });
    }
  }

  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
}
