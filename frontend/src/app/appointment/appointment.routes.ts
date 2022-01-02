declare const angular;
declare const require;

export const appointmentRoutingConfig = angular.module('appointmentRoutingConfig', [])
  .config(Config);

export default appointmentRoutingConfig.name;


Config.$inject = ['$stateProvider'];

function Config($stateProvider) {
  $stateProvider
    .state('add-appointment', {
      url: '/appointments/add?{id:int}',
      template: require('./edit/appointment-edit.controller-view.html'),
      controller: 'AppointmentEditController as vm',
      resolve: {
        patientList: (Patient) => {
          return Patient.query();
        },
        doctorList: DoctorResolver,
        pageTitle: PageTitleResolver
      }
    })

    .state('appointments', {
      url: '/appointments',
      template: require('./list/appointment-list.controller-view.html'),
      controller: 'AppointmentListController as vm',
      resolve: {
        appointmentList: AppointmentResolver
      }
    });

  AppointmentResolver.$inject = ['Appointment'];

  function AppointmentResolver(Appointment) {
    return Appointment.query().$promise;
  }


  PageTitleResolver.$inject = ['$stateParams'];

  function PageTitleResolver($stateParams) {
    return $stateParams?.id > 0 ? 'Edit' : 'Create';
  }


  DoctorResolver.$inject = ['Doctor'];

  function DoctorResolver(Doctor) {
    return Doctor.query();
  }
}


