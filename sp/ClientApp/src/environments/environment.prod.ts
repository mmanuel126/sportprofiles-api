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
};
