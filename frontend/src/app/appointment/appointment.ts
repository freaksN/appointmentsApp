declare const angular;
import appointmentRoutingConfig from './appointment.routes';
import appointmentEditControllerModule from './edit/appointment-edit.controller';
import appointmentListControllerModule from './list/appointment-list.controller';
import appointmentDomain from './domain/Appointment';
import doctorDomain from '.././doctor/domain/Doctor';
import modalControllerModule from '../modals/delete/modal-delete-controller';


export const appAppointment = angular.module('app.appointment', [
  'ui.router',
  appointmentDomain,
  doctorDomain,
  appointmentRoutingConfig,
  appointmentListControllerModule,
  appointmentEditControllerModule,
  modalControllerModule,

]);
export default appAppointment.name;
