declare const angular;
declare const require;
import './patient-list.styles.scss';

export const patientListControllerModule = angular.module('patientListControllerModule', [])
  .controller('PatientListController', PatientListController);

export default patientListControllerModule.name;


PatientListController.$inject = ['$scope', 'Patient', 'patientList', 'ngDialog'];

function PatientListController($scope, Patient, patientList, ngDialog) {
  let vm = this;
  vm.patients = patientList;
  vm.patientSelectedToRemove = null;
  vm.removePatient = removePatient;
  vm.patientHasAppointments = false;
  vm.showDeletedPatientNotification = '';
  vm.showEditPatientNotification = '';
  vm.downloadPatientsDataUrl = generateDownloadPatientsUrl;
  vm.openDeleteDialog = openDeleteDialog;
  init();

  function init() {
    initPatientRemovedInEdit();
    initPatientEdited();
  }

  /**
   * open delete confirmation modal and handle remove patient action
   */
  function openDeleteDialog(patient) {
    vm.patientSelectedToRemove = getPatientFromList(patient.id)[0];
    let modalTitle = vm.patientSelectedToRemove.firstName + ', ' + vm.patientSelectedToRemove.lastName;
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
   * generates the delete notification
   * @param patient
   * @param action
   */
  function generateNotification(patient, action) {
    vm.showEditPatientNotification = '';
    return 'The patient "' + patient.firstName + ', ' + patient.lastName + '" has been successfully ' + action;
  }


  /**
   * remove the selected patient
   */
  function removePatient() {
    Patient.delete({id: vm.patientSelectedToRemove.id}).$promise
      .then(function successCallback() {
        onRemoveSuccess();
      }, function errorCallback(err) {
        onRemoveError(err);
      });
  }

  /**
   * handle remove success callback
   */
  function onRemoveSuccess() {
    vm.showDeletedPatientNotification = generateNotification(vm.patientSelectedToRemove, 'deleted');
    removePatientFromList(vm.patientSelectedToRemove.id);
    console.log('Patient data successfully deleted');
  }

  /**
   * handle remove error callback
   * @param err
   */
  function onRemoveError(err) {
    vm.showDeletedPatientNotification = '';
    vm.showEditPatientNotification = '';
    vm.patientHasAppointments = err?.data?.status === 412 && err?.data?.message.includes('Patient already assigned to an appointment');
    let modalTitle = vm.patientSelectedToRemove;
    ngDialog.open({
      template: require('../../modals/delete/modal-delete-patient-error-view.html'),
      className: 'ngdialog-theme-default',
      controller: 'DeleteModalController as vm',
      plain: true,
      width: '50%',
      data: modalTitle,
    });

  }

  /**
   * add the patient selected for removal in a variable so that it can be shown in the HTML
   * @param id
   */
  function getPatientFromList(id: number) {
    return patientList.filter(patient => patient.id === id);
  }

  /**
   * remove the selected patient from the patientList.
   * Main goal is to inform the user which patient was removed without reloading the page
   * @param id
   */
  function removePatientFromList(id: number) {
    let index = patientList.findIndex(patient => patient.id === id);
    if (index > -1) {
      patientList.splice(index, 1);
    }
  }

  /**
   * check if an patient has been deleted within the edit view and notify the user
   */
  function initPatientRemovedInEdit() {
    let removedPatientInEdit = sessionStorage.getItem('removedPatient');
    if (removedPatientInEdit !== null) {
      vm.patientSelectedToRemove = JSON.parse(removedPatientInEdit);
      vm.showDeletedPatientNotification = generateNotification(vm.patientSelectedToRemove, 'deleted');
      sessionStorage.clear();
    }
  }

  /**
   * check if a patient has been created/edited within the edit view and inform the user about it
   */
  function initPatientEdited() {
    let editedPatient = sessionStorage.getItem('editedPatient');
    let removedPatientInEdit = sessionStorage.getItem('removedPatient');
    if (editedPatient !== null && removedPatientInEdit == null) {
      let patient = JSON.parse(editedPatient);
      let editedOrCreated = JSON.parse(sessionStorage.getItem('edited')) === true ? 'edited.' : 'created.';
      vm.showEditPatientNotification = generateNotification(patient, editedOrCreated);
      sessionStorage.clear();
    }
  }

  /**
   * generates the URL for the export and download of patients' data based on user's selected file
   * @param typeOfFile
   */
  function generateDownloadPatientsUrl(typeOfFile: string) {
    let patientIds = vm.patients.filter(patient => patient.id > 0).map(x => x.id).join(',');
    return 'http://localhost:8080/api/patient/downloadExport?exportFormat=' + typeOfFile + '&extension=' + typeOfFile + '&patients=' + patientIds;
  }
}

