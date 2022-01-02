declare const angular;
import patientRoutingConfig from './patient.routes';
import patientListControllerModule from './list/patient-list.controller';
import patientEditControllerModule from './edit/patient-edit.controller';
import patientDomain from './domain/Patient';
import modalControllerModule from '../modals/delete/modal-delete-controller';

export const appPatient = angular.module('app.patient', [
  'ui.router',
  patientDomain,
  patientRoutingConfig,
  patientListControllerModule,
  patientEditControllerModule,
  modalControllerModule
]);
export default appPatient.name;
