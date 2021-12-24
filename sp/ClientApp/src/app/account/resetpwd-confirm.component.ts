import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-resetpwd-confirm',
  templateUrl: './resetpwd-confirm.component.html',
  styleUrls: ['./resetpwd-confirm.component.css'],
})

export class ResetPwdConfirmComponent {
  public webSiteDomain = environment.webSiteDomain;
  public appLogoText = environment.appLogoText;
  public constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }
}