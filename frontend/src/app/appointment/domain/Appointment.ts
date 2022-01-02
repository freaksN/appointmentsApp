export const appointmentDomain = angular.module('appointmentDomain', [])
  .factory('Appointment', function ($resource) {
    return $resource('http://localhost:8080/api/:id/:fromDate/:toDate', {id: '@id'}, {
      get: {
        method: 'GET',
        url: 'http://localhost:8080/appointment/:id',
        cache: true,
        isArray: false
      },
      query: {
        method: 'GET',
        url: 'http://localhost:8080/appointment/',
        isArray: true,
      },
      searchByDate: {
        method: 'GET',
        url: 'http://localhost:8080/api/appointment/getAllAppointmentsAndPatientsByDates',
        params: {fromDate: '@fromDate', toDate: '@toDate'},
        isArray: true,
        cache: true
      },
      update: {
        method: 'PUT',
        url: 'http://localhost:8080/appointment/:id',
      },
      save: {
        method: 'POST',
        url: 'http://localhost:8080/appointment/',
      },
      delete: {
        method: 'DELETE',
        url: 'http://localhost:8080/appointment/:id'
      }
    });

  });


export default appointmentDomain.name;
