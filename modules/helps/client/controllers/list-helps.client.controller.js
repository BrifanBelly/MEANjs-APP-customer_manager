(function () {
  'use strict';

  angular
    .module('helps')
    .controller('HelpsListController', HelpsListController);

  HelpsListController.$inject = ['HelpsService'];

  function HelpsListController(HelpsService) {
    var vm = this;

    vm.helps = HelpsService.query();
  }
})();
