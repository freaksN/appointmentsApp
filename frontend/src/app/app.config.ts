declare const angular;

export const appConfig = angular.module('appConfig', [])
    .config(Config);

export default appConfig.name;

Config.$inject = ['$locationProvider'];
function Config($locationProvider){
  $locationProvider.hashPrefix('');
}

