import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: true,
  apiUrl: '/api',
  webServiceURL: "http://www.sportprofiles.net/services/",
  appName: "SportProfiles.net",
  appLogo: "../assets/img/lgicon.jpg",
  appLogoText: "Sport Profiles",
  companyName: "SportProfiles.net",
  webSiteDomain: "http://localhost",
  memberImagesUrlPath: "http://www.sportprofiles.net/images/members/",
  networkImagesUrlPath: "www.sportprofiles.net/images/networks/",
  eventImageUrlpath: "www.sportprofiles.net/images/events/",
  logging: {
    serverLoggingUrl: 'http://sportprofiles.net/services/common/logs',
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR
  }
}
