export const patientDomain = angular.module('patientDomain', [])
  .factory('Patient', function ($resource) {
    return $resource('http://localhost:8080/api/:id', {id: '@id'}, {
      get: {
        method: 'GET',
        url: 'http://localhost:8080/patient/:id',
        cache: true,
        isArray: false
      },
      query: {
        method: 'GET',
        url: 'http://localhost:8080/patient/',
        isArray: true,
      },
      update: {
        method: 'PUT',
        url: 'http://localhost:8080/patient/:id',
      },
      save: {
        method: 'POST',
        url: 'http://localhost:8080/patient/',
      },
      delete: {
        method: 'DELETE',
        url: 'http://localhost:8080/patient/:id'
      }
    });
  });


export default patientDomain.name;
