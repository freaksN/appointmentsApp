declare const angular;

import './app.styles.scss';

/**
 * Import Application Modules
 */
import appConfig from './app.config';
import appRoutingConfig from './app.routes';
import appAppointment from './appointment/appointment';
import appPatient from './patient/patient';

export const moduleName =
  angular.module('application', [
    'ui.router',
    'ngResource',
    '720kb.datepicker',
    'ngDialog',
    appConfig,
    appRoutingConfig,
    appAppointment,
    appPatient
  ])
    .name;
