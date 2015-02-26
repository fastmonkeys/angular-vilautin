describe('BritneyController', function() {
  var controller;
  var $rootScope;
  var $timeout;
  var appendNotification;
  var flashNotification = {
    id: 'notification_1',
    message: 'Test',
    severity: 'warning',
    sticky: false
  };
  var stickyNotification = {
    id: 'notification_2',
    message: 'Test',
    severity: 'warning',
    sticky: true
  };

  beforeEach(angular.mock.module('britney'));
  beforeEach(angular.mock.inject(function(_$timeout_, _$rootScope_, $controller) {
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    controller = $controller('BritneyController');
  }));

  it('has the correct initial state', function() {
    expect(angular.isObject(controller.notifications)).toBe(true);
  });

  it('removes correct notification when calling removeNotification', function() {
    controller.notifications = { 
      'notification_2': stickyNotification
    };

    expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();
    controller.removeNotification(stickyNotification.id);
    expect(controller.notifications[stickyNotification.id]).toBeUndefined();
  });

  it('empties all notifications when the $stateChangeStart event is triggered for $rootScope',
    function() {
      controller.notifications = {
        'notification_2': stickyNotification
      };
      expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();

      $rootScope.$broadcast('$stateChangeStart');
      $rootScope.$digest();

      expect(controller.notifications[stickyNotification.id]).toBeUndefined();

    });

  it('adds notification to the scope when add-notification -event is triggered on $rootScope',
    function() {
      $rootScope.$broadcast('event:add-notification', stickyNotification);
      $rootScope.$digest();
      expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();
    });

  it('removes flash notification from the scope after 5 seconds', function() {
    $rootScope.$broadcast('event:add-notification', flashNotification);
    $rootScope.$digest();

    expect(controller.notifications[flashNotification.id]).not.toBeUndefined();

    $timeout.flush(4999);
    expect(controller.notifications[flashNotification.id]).not.toBeUndefined();

    $timeout.flush(1);
    expect(controller.notifications[flashNotification.id]).toBeUndefined();
  });

  describe('Notification validation', function() {
    beforeEach(angular.mock.inject(function($controller) {
      spyOn($rootScope, '$on').andCallFake(function(eventName, callback) {
        if (eventName === 'event:add-notification') {
          appendNotification = callback;
          $rootScope.$on.andCallThrough();
        }
      });
      controller = $controller('BritneyController');
    }));

    it('does not add invalid notifications to the scope when invalid message', function() {
      var invalidNotification = angular.extend({}, stickyNotification, {message: 123});
      var message = '(Britney) notification message must be a String. Please read docs at ' +
        'https://github.com/fastmonkeys/britney';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });

    it('does not add invalid notifications to the scope when invalid severity', function() {
      var invalidNotification = angular.extend({}, stickyNotification, { severity: ['error'] });
      var message = '(Britney) notification severity value is not supported. Please read docs at ' +
        'https://github.com/fastmonkeys/britney';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });

    it('does not add invalid notifications to the scope when invalid sticky value', function() {
      var invalidNotification = angular.extend({}, stickyNotification, { sticky: 'like syrup' });
      var message = '(Britney) notification sticky value must be a Boolean. Please read docs at ' +
        'https://github.com/fastmonkeys/britney';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });
  });
});
