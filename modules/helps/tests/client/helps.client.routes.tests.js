(function () {
  'use strict';

  describe('Helps Route Tests', function () {
    // Initialize global variables
    var $scope,
      HelpsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HelpsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HelpsService = _HelpsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('helps');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/helps');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HelpsController,
          mockHelp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('helps.view');
          $templateCache.put('modules/helps/client/views/view-help.client.view.html', '');

          // create mock Help
          mockHelp = new HelpsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Help Name'
          });

          //Initialize Controller
          HelpsController = $controller('HelpsController as vm', {
            $scope: $scope,
            helpResolve: mockHelp
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:helpId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.helpResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            helpId: 1
          })).toEqual('/helps/1');
        }));

        it('should attach an Help to the controller scope', function () {
          expect($scope.vm.help._id).toBe(mockHelp._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/helps/client/views/view-help.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HelpsController,
          mockHelp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('helps.create');
          $templateCache.put('modules/helps/client/views/form-help.client.view.html', '');

          // create mock Help
          mockHelp = new HelpsService();

          //Initialize Controller
          HelpsController = $controller('HelpsController as vm', {
            $scope: $scope,
            helpResolve: mockHelp
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.helpResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/helps/create');
        }));

        it('should attach an Help to the controller scope', function () {
          expect($scope.vm.help._id).toBe(mockHelp._id);
          expect($scope.vm.help._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/helps/client/views/form-help.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HelpsController,
          mockHelp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('helps.edit');
          $templateCache.put('modules/helps/client/views/form-help.client.view.html', '');

          // create mock Help
          mockHelp = new HelpsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Help Name'
          });

          //Initialize Controller
          HelpsController = $controller('HelpsController as vm', {
            $scope: $scope,
            helpResolve: mockHelp
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:helpId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.helpResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            helpId: 1
          })).toEqual('/helps/1/edit');
        }));

        it('should attach an Help to the controller scope', function () {
          expect($scope.vm.help._id).toBe(mockHelp._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/helps/client/views/form-help.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
