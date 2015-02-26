describe('britneyService', function() {

  var Britney;
  var notifications;
  var $rootScope;
  var testMessage = 'Your computer is about to melt down!';
  var testSeverity = 'warning';
  var defaultSeverity = 'info';
  var testStateName = 'testState';
  var notificationEvent = 'event:add-notification';

  beforeEach(angular.mock.module('britney'));

  beforeEach(angular.mock.inject(function(_$rootScope_, _Britney_) {
    $rootScope = _$rootScope_;
    Britney = _Britney_;
    notifications = [];
    spyOn($rootScope, '$broadcast').andCallThrough();
  }));

  afterEach(function() {
    $rootScope.$broadcast.reset();
  });

  function getAndTestNextNotification() {
    var args = $rootScope.$broadcast.mostRecentCall.args;
    var eventName = args[0];
    var notification = args[1];
    expect(eventName).toBe(notificationEvent);
    expect(angular.isObject(notification)).toBe(true);
    expect(notification.id).toMatch('notification_');
    return notification;
  }

  it('showFlashNotification emits a add-notification event with the correct message, ' +
  'stickiness and severity', function() {
    var notification;
    Britney.showFlashNotification({
      message: testMessage,
      severity: testSeverity
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = getAndTestNextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(false);
  });

  it('showFlashNotification emits an add-notification event with the correct message and ' +
  'severity, and with default severity', function() {
    var notification;
    Britney.showFlashNotification({
      message: testMessage
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = getAndTestNextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(defaultSeverity);
    expect(notification.sticky).toBe(false);
  });

  it('showStickyNotification emits an add-notification event with the correct message, ' +
  'stickiness and severity', function() {
    var notification;
    Britney.showStickyNotification({
      message: testMessage,
      severity: testSeverity
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = getAndTestNextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('showStickyNotification emits an add-notification event with the message and severity, ' +
  'with the correct default severity', function() {
    var notification;
    Britney.showStickyNotification({
      message: testMessage
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = getAndTestNextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(defaultSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('dispatchRiggedNotifications emits nothing if there are no notifications rigged to the ' +
  'given route', function() {
    var notification;
    Britney.rigRouteNotification({
      message: testMessage,
      severity: testSeverity,
      sticky: true
    }, testStateName);

    expect($rootScope.$broadcast.callCount).toBe(0);

    $rootScope.$broadcast('$stateChangeSuccess', {name: 'otherState'});
    // should not broadcast other events
    expect($rootScope.$broadcast.callCount).toBe(1);
  });

  it('dispatchRiggedNotifications emits one add-notification event with the correct message, ' +
  'stickiness and severity, when one notification is rigged to the correct route', function() {
    var notification;
    Britney.rigRouteNotification({
      message: testMessage,
      severity: testSeverity,
      sticky: true
    }, testStateName);

    Britney.rigRouteNotification({
      message: 'blah',
      severity: 'success'
    }, 'otherState');

    // event is not dispatched immediately
    expect($rootScope.$broadcast.callCount).toBe(0);

    $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
    expect($rootScope.$broadcast.callCount).toBe(2);

    notification = getAndTestNextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('calling dispatchRiggedNotifications multiple times does not dispatch any additional events',
    function() {
      Britney.rigRouteNotification({
        message: testMessage,
        severity: testSeverity,
        sticky: true
      }, testStateName);

      Britney.rigRouteNotification({
        message: 'blah',
        severity: 'success'
      }, 'otherState');

      // event is not dispatched immediately
      expect($rootScope.$broadcast.callCount).toBe(0);

      $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
      expect($rootScope.$broadcast.callCount).toBe(2);

      $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
      expect($rootScope.$broadcast.callCount).toBe(3);
    });

  it('dispatchRiggedNotifications emits one add-notification event with the correct message, ' +
  'and default stickiness and severity, when one notification is rigged to the correct route',
    function() {
      var notification;
      Britney.rigRouteNotification({
        message: testMessage
      }, testStateName);

      // event is not dispatched immediately
      expect($rootScope.$broadcast.callCount).toBe(0);

      $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
      expect($rootScope.$broadcast.callCount).toBe(2);

      notification = getAndTestNextNotification();
      expect(notification.message).toBe(testMessage);
      expect(notification.severity).toBe(defaultSeverity);
      expect(notification.sticky).toBe(false);
    });
});
