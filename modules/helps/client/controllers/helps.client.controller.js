(function () {
  'use strict';

  // Helps controller
  angular
    .module('helps')
    .controller('HelpsController', HelpsController);

  HelpsController.$inject = ['$scope', '$state', 'Authentication', 'helpResolve'];

  function HelpsController ($scope, $state, Authentication, help) {
    var vm = this;

    vm.authentication = Authentication;
    vm.help = help;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Help
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.help.$remove($state.go('helps.list'));
      }
    }

    // Save Help
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.helpForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.help._id) {
        vm.help.$update(successCallback, errorCallback);
      } else {
        vm.help.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('helps.view', {
          helpId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
