import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-google-ads',
  template: ` <div>
        <ins class="adsbygoogle"
           style="display:block;"
            data-ad-client="ca-pub-4574582494573662" google_adtest="on"
            data-ad-format="auto"></ins>
         </div>   
            <br>            
  `,

})
export class GoogleAdsComponent implements AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
      } catch (e) {
        console.error(e);
      }
    }, 2000);
  }

}
