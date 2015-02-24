describe('Controller: FlasherCtrl', function() {

  var $scope, $rootScope, $timeout;
      flashNotification = {
        id: 'notification_1',
        message: 'Test',
        severity: 'warning',
        sticky: false
      },
      stickyNotification = {
        id: 'notification_2',
        message: 'Test',
        severity: 'warning',
        sticky: true
      };

  beforeEach(function() {
    module('britney');

    inject(function($injector) {
      var $controller = $injector.get('$controller');
      
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');

      $scope = $rootScope.$new();
      $controller('FlasherCtrl', { $scope: $scope, $rootScope: $rootScope });
    });

    // digest the stateChangeStart events caused by the test suite loading
    $rootScope.$digest();
  });

  it('has the correct initial state', function() {
    expect(angular.isObject($scope.notifications)).toBe(true);
  });

  it('removes correct notification when calling removeNotification', function() {
    $scope.notifications = { 
      'notification_2': stickyNotification
    };

    expect($scope.notifications[stickyNotification.id]).not.toBeUndefined();
    $scope.removeNotification(stickyNotification.id);
    expect($scope.notifications[stickyNotification.id]).toBeUndefined();
  });

  it('empties all notifications when the $stateChangeStart event is triggered for $rootScope', function() {
    $scope.notifications = { 
      'notification_2': stickyNotification
    };
    expect($scope.notifications[stickyNotification.id]).not.toBeUndefined();

    $rootScope.$broadcast('$stateChangeStart');
    $rootScope.$digest();

    expect($scope.notifications[stickyNotification.id]).toBeUndefined();

  });

  it('adds notification to the scope when add-notification -event is triggered on $rootScope', function() {
    $rootScope.$broadcast('event:add-notification', stickyNotification);
    $rootScope.$digest();
    expect($scope.notifications[stickyNotification.id]).not.toBeUndefined();
  });

  it('does not add invalid notifications to the scope when add-notification -event is triggered on $rootScope', function() {

    // invalid id (not a String)
    $rootScope.$broadcast('event:add-notification', angular.extend({}, stickyNotification, { id: 123 }));
    $rootScope.$digest();
    expect($scope.notifications[123]).toBeUndefined();

    // invalid id (does not start with 'notification_')
    $rootScope.$broadcast('event:add-notification', angular.extend({}, stickyNotification, { id: 'failification_2' }));
    $rootScope.$digest();
    expect($scope.notifications[123]).toBeUndefined();

    // invalid message (not a String)
    $rootScope.$broadcast('event:add-notification', angular.extend({}, stickyNotification, { message: 123 }));
    $rootScope.$digest();
    expect($scope.notifications[stickyNotification.id]).toBeUndefined();

    // invalid severity (not a String)
    $rootScope.$broadcast('event:add-notification', angular.extend({}, stickyNotification, { severity: ['error'] }));
    $rootScope.$digest();
    expect($scope.notifications[stickyNotification.id]).toBeUndefined();

    // invalid stickiness (not a Boolean)
    $rootScope.$broadcast('event:add-notification', angular.extend({}, stickyNotification, { sticky: 'like syrup' }));
    $rootScope.$digest();
    expect($scope.notifications[stickyNotification.id]).toBeUndefined();

  });

  it('removes flash notification from the scope after 5 seconds', function() {
    $rootScope.$broadcast('event:add-notification', flashNotification);
    $rootScope.$digest();
    expect($scope.notifications[flashNotification.id]).not.toBeUndefined();

    // not 4 seconds
    $timeout.flush(4000);
    expect($scope.notifications[flashNotification.id]).not.toBeUndefined();

    $timeout.flush(1000);
    expect($scope.notifications[flashNotification.id]).toBeUndefined();
  });
});
