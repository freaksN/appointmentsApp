declare const angular;
declare const require;
import './patient-edit.styles.scss';


export const patientEditControllerModule = angular.module('patientEditControllerModule', [])
  .controller('PatientEditController', PatientEditController);

export default patientEditControllerModule.name;


PatientEditController.$inject = ['$scope', 'Patient', '$state', '$stateParams', 'pageTitle', 'ngDialog'];

function PatientEditController($scope, Patient, $state, $stateParams, pageTitle, ngDialog) {
  let vm = this;
  vm.patient = {
    firstName: null,
    lastName: null,
    notes: null
  };
  vm.submit = submit;
  vm.patientSelectedToRemove = '';
  vm.patientHasAppointments = false;
  vm.removePatient = removePatient;
  vm.pageTitle = pageTitle;
  vm.openDeleteDialog = openDeleteDialog;
  init();

  /**
   * initialize and preload patient data
   */
  function init() {
    Patient.get({id: $stateParams.id})
      .$promise.then(
      function successCallback(res) {
        return vm.patient = res;
      }, function errorCallback(err) {
        console.log(err);
      });
  }

  /**
   * open delete confirmation modal and handle remove patient action
   */
  function openDeleteDialog() {
    let modalTitle = vm.patient.firstName + ', ' + vm.patient.lastName;
    ngDialog.openConfirm({
      template: require('../../modals/delete/modal-delete-confirmation-view.html'),
      className: 'ngdialog-theme-default',
      controller: 'DeleteModalController as vm',
      plain: true,
      width: '30%',
      data: modalTitle,
      closeByDocument: false,
    }).then(function (confirm) {
        removePatient();
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
    return id ? Patient.update({id: id}, data) : Patient.save(data);
  }

  /**
   * submit and validate patient data
   */
  function submit() {
    getAction($stateParams.id, vm.patient).$promise
      .then(function successCallback() {
        onSubmitSuccess();
      }, function errorCallback(err) {
        console.log(err);
      });
  }

  /**
   * handle submit success callback
   */
  function onSubmitSuccess() {
    addEditPatientToSessionStorage();
    vm.patient = {};
    $state.go('patients');
  }

  /**
   * remove the selected patient
   */
  function removePatient() {
    addRemovedPatientToSessionStorage(vm.patient);
    Patient.delete({id: vm.patient.id}).$promise
      .then(function successCallback() {
        onRemoveSuccess();
      }, function errorCallback(response) {
        onRemoveError(response);
      });
  }

  /**
   * handle remove success callback
   */
  function onRemoveSuccess() {
    console.log('Patient data deleted successfully');
    $state.go('patients');
  }

  /**
   * handle remove error callback
   * @param response
   */
  function onRemoveError(response) {
    vm.patientHasAppointments = response?.data.status === 412 && response?.data?.message.includes('Patient already assigned to an appointment');
    let modalTitle = vm.patient;
    ngDialog.open({
      template: require('../../modals/delete/modal-delete-patient-error-view.html'),
      className: 'ngdialog-theme-default',
      controller: 'DeleteModalController as vm',
      plain: true,
      width: '50%',
      data: modalTitle,
    });
    sessionStorage.clear();
  }

  /**
   * store the removed patient in the storage session
   * @param id
   */
  function addRemovedPatientToSessionStorage(id: number) {
    sessionStorage.setItem('removedPatient', JSON.stringify(vm.patient));
  }

  /**
   * store the added/edited patient in the storage session
   */
  function addEditPatientToSessionStorage() {
    sessionStorage.setItem('edited', $stateParams.id ? 'true' : 'false');
    sessionStorage.setItem('editedPatient', JSON.stringify(vm.patient));
  }
}
