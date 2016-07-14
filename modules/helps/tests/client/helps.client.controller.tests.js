(function () {
  'use strict';

  describe('Helps Controller Tests', function () {
    // Initialize global variables
    var HelpsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      HelpsService,
      mockHelp;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _HelpsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      HelpsService = _HelpsService_;

      // create mock Help
      mockHelp = new HelpsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Help Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Helps controller.
      HelpsController = $controller('HelpsController as vm', {
        $scope: $scope,
        helpResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleHelpPostData;

      beforeEach(function () {
        // Create a sample Help object
        sampleHelpPostData = new HelpsService({
          name: 'Help Name'
        });

        $scope.vm.help = sampleHelpPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (HelpsService) {
        // Set POST response
        $httpBackend.expectPOST('api/helps', sampleHelpPostData).respond(mockHelp);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Help was created
        expect($state.go).toHaveBeenCalledWith('helps.view', {
          helpId: mockHelp._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/helps', sampleHelpPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Help in $scope
        $scope.vm.help = mockHelp;
      });

      it('should update a valid Help', inject(function (HelpsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/helps\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('helps.view', {
          helpId: mockHelp._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (HelpsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/helps\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Helps
        $scope.vm.help = mockHelp;
      });

      it('should delete the Help and redirect to Helps', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/helps\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('helps.list');
      });

      it('should should not delete the Help and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
