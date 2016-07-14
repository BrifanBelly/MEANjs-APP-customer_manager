(function () {
  'use strict';

  angular
    .module('helps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('helps', {
        abstract: true,
        url: '/helps',
        template: '<ui-view/>'
      })
      .state('helps.list', {
        url: '',
        templateUrl: 'modules/helps/client/views/list-helps.client.view.html',
        controller: 'HelpsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Helps List'
        }
      })
      .state('helps.create', {
        url: '/create',
        templateUrl: 'modules/helps/client/views/form-help.client.view.html',
        controller: 'HelpsController',
        controllerAs: 'vm',
        resolve: {
          helpResolve: newHelp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Helps Create'
        }
      })
      .state('helps.edit', {
        url: '/:helpId/edit',
        templateUrl: 'modules/helps/client/views/form-help.client.view.html',
        controller: 'HelpsController',
        controllerAs: 'vm',
        resolve: {
          helpResolve: getHelp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Help {{ helpResolve.name }}'
        }
      })
      .state('helps.view', {
        url: '/:helpId',
        templateUrl: 'modules/helps/client/views/view-help.client.view.html',
        controller: 'HelpsController',
        controllerAs: 'vm',
        resolve: {
          helpResolve: getHelp
        },
        data:{
          pageTitle: 'Help {{ articleResolve.name }}'
        }
      });
  }

  getHelp.$inject = ['$stateParams', 'HelpsService'];

  function getHelp($stateParams, HelpsService) {
    return HelpsService.get({
      helpId: $stateParams.helpId
    }).$promise;
  }

  newHelp.$inject = ['HelpsService'];

  function newHelp(HelpsService) {
    return new HelpsService();
  }
})();
