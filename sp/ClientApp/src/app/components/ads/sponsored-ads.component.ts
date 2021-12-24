import { Component, OnInit } from '@angular/core';
import { JobsModel } from '../../models/jobs.model';
import { IAdsService } from '../../services/ads.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-sponsored-ads',
   templateUrl: './sponsored-ads.component.html',
   styleUrls: ['./sponsored-ads.component.scss']
})
export class SponsoredAdsComponent implements OnInit {

   jobs: Promise<JobsModel[]>;
   jobDesc: String;
   jobTitle: String;
   howToApply: String;

   body: JobParams = {
      description: "",
      location: null,
      latitude: null,
      longitude: null,
      full_time: null
   }

   modHand: NgbModalRef;

   constructor(public adsSvc: IAdsService, public ngbMod: NgbModal,) {

   }

   ngOnInit() {
       this.getData();
   }

   async getData() {
      this.jobs = this.adsSvc.getGitHubJobs(this.body);
      console.log(this.jobs);
   }

   showJobDescPopup(modal, desc, howToApply, title) {
      this.jobTitle = title;
      this.jobDesc = desc;
      this.howToApply = howToApply;
      this.modHand = this.ngbMod.open(modal);
      return false;
   }

}

export class JobParams {
   description: string;
   location: string;
   latitude: string;
   longitude: string;
   full_time: string;
}
