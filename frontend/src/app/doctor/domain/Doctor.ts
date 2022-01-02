export const doctorDomain = angular.module('doctorDomain', [])
  .factory('Doctor', function ($resource) {
    return $resource('http://localhost:8080/doctor:id', {id: '@id'}, {
      query: {
        method: 'GET',
        url: 'http://localhost:8080/doctor',
        isArray: true,
      }
    });
  });

export default doctorDomain.name;
