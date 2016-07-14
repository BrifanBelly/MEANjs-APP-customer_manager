(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', 'Authentication','CustomersService', 'customerResolve'];

  function CustomersController ($scope, $state, Authentication,CustomersService, customer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
      vm.customers = CustomersService.query();
      vm.pageSize = 5;
      vm.currentPage = 1;

      vm.setpage = function(page){
          console.log(page);
          vm.currentpage = page;


      };

      console.log(vm.customer);

    // Remove existing Customer
    function remove(C) {
       // console.log(C);
      if (confirm('Are you sure you want to delete?')) {
        C.$remove(removeSuccess);
      }
    }
      function removeSuccess(){
          $state.go('customers.create');
          vm.customer = {};
          vm.customers = CustomersService.query();

      }

    // Save Customer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customers.create');
          vm.customer = {};
          vm.customers = CustomersService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
