describe('VilautinController', function() {
  var controller;
  var $rootScope;
  var $timeout;
  var appendNotification;
  var NOTIFICATION_EVENT;
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

  beforeEach(angular.mock.module('vilautin'));
  beforeEach(angular.mock.inject(function(_$timeout_, _$rootScope_,  _NOTIFICATION_EVENT_, $controller) {
    jasmine.Clock.useMock();
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    NOTIFICATION_EVENT = _NOTIFICATION_EVENT_;
    controller = $controller('VilautinController');
  }));

  it('should have a correct initial state', function() {
    expect(angular.isObject(controller.notifications)).toBe(true);
  });

  it('should remove correct notification when calling removeNotification', function() {
    controller.notifications = { 
      'notification_2': stickyNotification
    };

    expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();
    controller.removeNotification(stickyNotification.id);
    expect(controller.notifications[stickyNotification.id]).toBeUndefined();
  });

  it('should empty all notifications when the $stateChangeStart is triggered', function() {
      controller.notifications = {
        'notification_2': stickyNotification
      };
      expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();

      $rootScope.$broadcast('$stateChangeStart');
      $rootScope.$digest();

      expect(controller.notifications[stickyNotification.id]).toBeUndefined();

    });

  it('should add notification to the scope when add-notification event is triggered', function() {
    $rootScope.$broadcast(NOTIFICATION_EVENT, stickyNotification);
      $rootScope.$digest();
      expect(controller.notifications[stickyNotification.id]).not.toBeUndefined();
    });

  it('should remove flash notification from the scope after 5 seconds', function() {
    $rootScope.$broadcast(NOTIFICATION_EVENT, flashNotification);
    $rootScope.$digest();

    expect(controller.notifications[flashNotification.id]).not.toBeUndefined();

    jasmine.Clock.tick(4999);
    expect(controller.notifications[flashNotification.id]).not.toBeUndefined();

    jasmine.Clock.tick(1);
    expect(controller.notifications[flashNotification.id]).toBeUndefined();
  });

  describe('Notification validation', function() {
    beforeEach(angular.mock.inject(function($controller) {
      spyOn($rootScope, '$on').andCallFake(function(eventName, callback) {
        if (eventName === NOTIFICATION_EVENT) {
          appendNotification = callback;
          $rootScope.$on.andCallThrough();
        }
      });
      controller = $controller('VilautinController');
    }));

    it('does not add invalid notifications to the scope when invalid message', function() {
      var invalidNotification = angular.extend({}, stickyNotification, {message: 123});
      var message = '(Vilautin) notification message must be a String. Please read docs at ' +
        'https://github.com/fastmonkeys/vilautin';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });

    it('does not add invalid notifications to the scope when invalid severity', function() {
      var invalidNotification = angular.extend({}, stickyNotification, { severity: ['error'] });
      var message = '(Vilautin) notification severity value is not supported. Please read docs at ' +
        'https://github.com/fastmonkeys/vilautin';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });

    it('does not add invalid notifications to the scope when invalid sticky value', function() {
      var invalidNotification = angular.extend({}, stickyNotification, { sticky: 'like syrup' });
      var message = '(Vilautin) notification sticky value must be a Boolean. Please read docs at ' +
        'https://github.com/fastmonkeys/vilautin';
      expect(function() {appendNotification({}, invalidNotification)}).toThrow(message);
    });
  });
});
