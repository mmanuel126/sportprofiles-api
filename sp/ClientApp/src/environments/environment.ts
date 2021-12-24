// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,
  apiUrl: '/api',
  webServiceURL:  "http://www.sportprofiles.net/services/" ,
  appName: "SportProfiles.net",
  appLogo: "../assets/img/lgicon.jpg",
  appLogoText: "Sport Profiles",
  companyName: "SportProfiles.net",
  webSiteDomain:"http://www.sportprofiles.net",
  memberImagesUrlPath:"http://www.sportprofiles.net/images/members/",
  networkImagesUrlPath:"http://www.sportprofiles.net/images/networks/",
  eventImageUrlpath:"http://www.sportprofiles.net/images/events/",
  logging: {
    serverLoggingUrl: 'http://www.sportprofiles.net/services/common/logs',
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR
  }
}