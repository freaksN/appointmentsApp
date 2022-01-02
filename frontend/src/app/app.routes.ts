declare const angular;

export const appRoutingConfig = angular.module('appRoutingConfig', [])
    .config(Config);

export default appRoutingConfig.name;


Config.$inject = ['$stateProvider', '$urlRouterProvider'];
function Config($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/appointments');
}

