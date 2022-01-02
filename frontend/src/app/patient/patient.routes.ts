declare const angular;
declare const require;

export const patientRoutingConfig = angular.module('patientRoutingConfig', [])
  .config(Config);

export default patientRoutingConfig.name;


Config.$inject = ['$stateProvider'];

function Config($stateProvider) {
  $stateProvider
    .state('add-patient', {
      url: '/patients/add?{id:int}',
      template: require('./edit/patient-edit.controller-view.html'),
      controller: 'PatientEditController as vm',
      resolve: {
        pageTitle: PageTitleResolver
      }
    })

    .state('patients', {
      url: '/patients',
      template: require('./list/patient-list.controller-view.html'),
      controller: 'PatientListController as vm',
      resolve: {
        patientList: PatientResolver
      }
    });


  PatientResolver.$inject = ['Patient'];

  function PatientResolver(Patient) {
    return Patient.query().$promise;
  }

  PageTitleResolver.$inject = ['$stateParams'];

  function PageTitleResolver($stateParams) {
    return $stateParams?.id > 0 ? 'Edit' : 'Create';
  }
}
