declare const angular;
declare const require;
import './appointment-list.styles.scss';


export const appointmentListControllerModule = angular.module('appointmentListControllerModule', [])
  .controller('AppointmentListController', AppointmentListController);

export default appointmentListControllerModule.name;

AppointmentListController.$inject = ['$scope', 'Appointment', 'appointmentList', '$state', 'ngDialog'];

function AppointmentListController($scope, Appointment, appointmentList, $state, ngDialog) {
  let vm = this;
  vm.appointments = appointmentList;
  vm.submitListForm = submitListForm;
  vm.fromDate = null;
  vm.toDate = null;
  vm.appointmenSelectedToRemove = null;
  vm.showDeletedAppointmentNotification = '';
  vm.showEditAppointmentNotification = '';
  vm.removeAppointment = removeAppointment;
  vm.downloadAppointmentsDataUrl = downloadAppointmentsDataUrl;
  vm.openDeleteDialog = openDeleteDialog;
  init();

  function init() {
    initAppointmentRemovedInEdit();
    initAppointmentEdited();
  }

  /**
   * open delete confirmation modal and handle remove appointment action
   */
  function openDeleteDialog(appointment) {
    vm.appointmenSelectedToRemove = getAppointmentFromList(appointment.id)[0];
    let modalTitle = vm.appointmenSelectedToRemove.appointmentDate + ', ' + vm.appointmenSelectedToRemove.appointmentTime + ' with Dr. ' + vm.appointmenSelectedToRemove.doctor.firstName + ' ' + vm.appointmenSelectedToRemove.doctor.lastName + ' and ' + vm.appointmenSelectedToRemove.patient.firstName + ', ' + vm.appointmenSelectedToRemove.patient.lastName;
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
   * generates the delete notification
   * @param appointment
   * @param action
   */
  function generateNotification(appointment, action) {
    vm.showEditAppointmentNotification = '';
    return 'The appointment on ' + appointment.appointmentDate + ' at ' + appointment.appointmentTime + ' with Dr. ' + appointment.doctor.firstName + ', ' + appointment.doctor.lastName + ' and ' + appointment.patient.firstName + ', ' + appointment.patient.lastName + ' has been successfully ' + action;
  }

  /**
   * remove the selected appointment
   */
  function removeAppointment() {
    if (vm.appointmenSelectedToRemove) {
      Appointment.delete({id: vm.appointmenSelectedToRemove.id}).$promise
        .then(function successCallback() {
          onRemoveSuccess();
          $state.go('appointments');
        }, function errorCallback(response) {
          onRemoveError(response);
        });
    }
  }

  /**
   * handle the remove success callback
   */
  function onRemoveSuccess() {
    vm.showDeletedAppointmentNotification = generateNotification(vm.appointmenSelectedToRemove, 'deleted');
    removeAppointmentFromList(vm.appointmenSelectedToRemove.id);
    console.log('Appointment data deleted successfully');
  }

  /**
   * handle the error callback
   * @param response
   */
  function onRemoveError(response) {
    console.log(response);
    vm.showDeletedAppointmentNotification = '';
  }


  /**
   * remove the selected appointment from the appointmentList.
   * Main goal is to inform the user which appointment was removed without reloading the page
   * @param id
   */
  function removeAppointmentFromList(id: number) {
    let index = appointmentList.findIndex(appointment => appointment.id === id);
    if (index > -1) {
      appointmentList.splice(index, 1);
    }
  }

  /**
   * add the selected appointment for removal in a variable so that it can be shown in the view
   * @param id
   */
  function getAppointmentFromList(id: number) {
    return appointmentList.filter(appointment => appointment.id === id);
  }

  /**
   * submit and get all appointments based on user input from- and to dates
   */
  function submitListForm() {
    vm.appointments = Appointment.searchByDate({fromDate: vm.fromDate, toDate: vm.toDate});
    vm.showEditAppointmentNotification = '';
    vm.showDeletedAppointmentNotification = '';
  }

  /**
   * check if an appointment has been deleted within the edit view and inform the user
   */
  function initAppointmentRemovedInEdit() {
    let appointmentDeletedInEdit = sessionStorage.getItem('removedAppointment');
    if (appointmentDeletedInEdit !== null) {
      vm.appointmenSelectedToRemove = JSON.parse(appointmentDeletedInEdit);
      vm.showDeletedAppointmentNotification = generateNotification(vm.appointmenSelectedToRemove, 'deleted');
      sessionStorage.clear();
    }
  }

  /**
   * check if an appointment has been created/edited within the edit view and inform the user
   */
  function initAppointmentEdited() {
    let appointmentEdited = sessionStorage.getItem('editedAppointment');
    const appointmentDeletedInEdit = sessionStorage.getItem('removedAppointment');
    if (appointmentEdited !== null && appointmentDeletedInEdit == null) {
      let appointment = JSON.parse(appointmentEdited);
      let editedOrCreated = JSON.parse(sessionStorage.getItem('edited')) === true ? 'edited' : 'created';
      vm.showEditAppointmentNotification = generateNotification(appointment, editedOrCreated);
      sessionStorage.clear();
    }
  }

  /**
   * generates the URL for the export and download of appointments' data based on user's selected file
   * @param typeOfFile
   */
  function downloadAppointmentsDataUrl(typeOfFile: string) {
    let appointmentIds = vm.appointments.filter(appointment => appointment.id > 0).map(x => x.id).join(',');
    return 'http://localhost:8080/api/appointment/downloadExport?exportFormat=' + typeOfFile + '&extension=' + typeOfFile + '&appointments=' + appointmentIds;
  }
}

