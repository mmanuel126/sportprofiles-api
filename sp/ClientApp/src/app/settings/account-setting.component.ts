import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SessionMgtService } from '../services/session-mgt.service';

@Component({
  selector: 'account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {


  constructor(public session: SessionMgtService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
