// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    apiUrlBase: 'http://localhost:8080/',
    apiVersion: 'api/v1/',
    loginOfficeUrl: 'http://localhost:8080/api/v1/auth/saml/login',

    //apiUrlBase:'https://api.devparqueosrrhh.claro.com.gt/',
    // apiUrlBase:'http://localhost:3500/',
    //loginOfficeUrl: 'https://api.devparqueosrrhh.claro.com.gt/api/v1/auth/saml/login',
}



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

