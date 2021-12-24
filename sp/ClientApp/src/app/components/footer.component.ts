import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public currentYear = new Date().getFullYear().toString();
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  constructor() { }

  ngOnInit() {
  }

}
