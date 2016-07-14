//Helps service used to communicate Helps REST endpoints
(function () {
  'use strict';

  angular
    .module('helps')
    .factory('HelpsService', HelpsService);

  HelpsService.$inject = ['$resource'];

  function HelpsService($resource) {
    return $resource('api/helps/:helpId', {
      helpId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
