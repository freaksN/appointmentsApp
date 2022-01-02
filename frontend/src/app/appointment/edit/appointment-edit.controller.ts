declare const angular;
declare const require;
import './appointment-edit.styles.scss';


export const appointmentEditControllerModule = angular.module('appointmentEditControllerModule', [])
  .controller('AppointmentEditController', AppointmentEditController);

export default appointmentEditControllerModule.name;


AppointmentEditController.$inject = ['$scope', 'Appointment', '$state', '$stateParams', 'patientList', 'pageTitle', 'doctorList', 'ngDialog'];

function AppointmentEditController($scope, Appointment, $state, $stateParams, patientList, pageTitle, doctorList, ngDialog) {
  let vm = this;
  vm.appointment = {
    appointmentDate: null,
    appointmentTime: null,
    doctor: null,
    patient: null
  };
  vm.patients = patientList;
  vm.doctors = doctorList;
  vm.submit = submit;
  vm.removeAppointment = removeAppointment;
  vm.errors = [];
  vm.isAppointmentTimeValid = isAppointmentTimeValid;
  vm.isAppointmentDateValid = isAppointmentDateValid;
  vm.pageTitle = pageTitle;
  vm.appointmentAlreadyExists = false;
  vm.openDeleteDialog = openDeleteDialog;

  init();

  /**
   * initialize and preload appointment data
   */
  function init() {
    Appointment.get({id: $stateParams.id})
      .$promise.then(
      function successCallback(res) {
        return vm.appointment = res;
      }, function errorCallback(err) {
        console.log(err);
      });
  }

  /**
   * open delete confirmation modal and handle remove appointment action
   */
  function openDeleteDialog(){
    let modalTitle = vm.appointment.appointmentDate + ', ' + vm.appointment.appointmentTime + ' with Dr. ' + vm.appointment.doctor.firstName + ' ' + vm.appointment.doctor.lastName + ' and ' + vm.appointment.patient.firstName + ', ' + vm.appointment.patient.lastName;
    ngDialog.openConfirm({
      template: require('../../modals/delete/modal-delete-confirmation-view.html'),
      className: 'ngdialog-theme-default',
      controller: 'DeleteModalController as vm',
      plain: true,
      width: '50%',
      data: modalTitle,
      closeByDocument: false,
    }).then(function (confirm) {
        removeAppointment();
      }, function (reject) {
      }
    );
  }


  /**
   * determine what action to execute
   * @param id
   * @param data
   */
  function getAction(id, data) {
    return id ? Appointment.update({id: id}, data) : Appointment.save(data);
  }

  /**
   * submit and validate appointment data
   */
  function submit() {
    const appointmentCopy = angular.copy(vm.appointment);
    appointmentCopy.appointmentDate = new Date(vm.appointment.appointmentDate.split('.').reverse().join('-'));
    getAction($stateParams.id, appointmentCopy).$promise
      .then(function successCallback() {
        onSubmitSuccess();
      }, function errorCallback(res) {
        onSubmitError(res);
      });
  }

  /**
   * handle the success callback
   */
  function onSubmitSuccess() {
    addEditAppointmentToSessionStorage();
    vm.appointment = {};
    $state.go('appointments');
  }

  /**
   * handle the error callback
   * @param res
   */
  function onSubmitError(res) {
    if (res.status === -1) {
      vm.appointmentAlreadyExists = true;
    }
    vm.errors = res.data?.errors;
  }


  /**
   * remove the selected appointment
   */
  function removeAppointment() {
      Appointment.delete({id: vm.appointment.id}).$promise
        .then(function successCallback() {
          onRemoveSuccess();
        }, function errorCallback(response) {
          console.log(response);
        });
  }

  /**
   * handle the remove success callback
   */
  function onRemoveSuccess() {
    addRemovedAppointmentToSessionStorage();
    console.log('Appointment data deleted successfully');
    vm.appointment = null;
    $state.go('appointments');
  }

  /**
   * validate the Appointment's Time
   */
  function isAppointmentTimeValid() {
    if (vm.errors.length) {
      vm.appointmentAlreadyExists = false;
      return JSON.stringify(vm.errors).includes('appointmentTime');
    }
  }

  /**
   * validate the Appointment's Date
   */
  function isAppointmentDateValid() {
    if (vm.errors.length) {
      vm.appointmentAlreadyExists = false;
      return JSON.stringify(vm.errors).includes('appointmentDate');
    }
  }

  /**
   * store the removed appointment in the storage session
   */
  function addRemovedAppointmentToSessionStorage() {
    sessionStorage.setItem('removedAppointment', JSON.stringify(vm.appointment));
  }

  /**
   * store the added/edited appointment in the storage session
   */
  function addEditAppointmentToSessionStorage() {
    sessionStorage.setItem('edited', $stateParams.id >= 0 ? 'true' : 'false');
    sessionStorage.setItem('editedAppointment', JSON.stringify(vm.appointment));
  }
}
