describe('Service: NotificationService', function() {

  var NotificationService, notifications,
      testMessage = 'Your computer is about to melt down!',
      testSeverity = 'warning',
      defaultSeverity = 'info',
      testRoute = '/test/route',
      notificationEvent = 'event:add-notification';

  beforeEach(function() {
    module('britney');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      NotificationService = $injector.get('Flasher');

      notifications = [];
      spyOn($rootScope, '$broadcast');
    });
  });

  function nextNotification() {
    var args = $rootScope.$broadcast.argsForCall.shift(),
      eventName = args[0], 
      notification = args[1];
    expect(eventName).toBe(notificationEvent);
    expect(angular.isObject(notification)).toBe(true);
    expect(notification.id).toMatch('notification_');
    return notification;
  }

  it('showFlashNotification emits a add-notification event with the correct message, stickiness and severity', function() {
    var notification;
    NotificationService.showFlashNotification({
      message: testMessage,
      severity: testSeverity
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(false);
  });

  it('showFlashNotification emits an add-notification event with the correct message and severity, and with default severity', function() {
    var notification;
    NotificationService.showFlashNotification({
      message: testMessage
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(defaultSeverity);
    expect(notification.sticky).toBe(false);
  });

  it('showStickyNotification emits an add-notification event with the correct message, stickiness and severity', function() {
    var notification;
    NotificationService.showStickyNotification({
      message: testMessage,
      severity: testSeverity
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('showStickyNotification emits an add-notification event with the message and severity, with the correct default severity', function() {
    var notification;
    NotificationService.showStickyNotification({
      message: testMessage
    });

    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(defaultSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('_dispatchRiggedNotifications emits nothing if there are no notifications rigged to the given route', function() {
    var notification;
    NotificationService.rigRouteNotification({
      message: testMessage,
      severity: testSeverity,
      sticky: true
    }, testRoute);

    // event is not dispatched immediately
    expect($rootScope.$broadcast.callCount).toBe(0);

    NotificationService._dispatchRiggedNotifications('/unrigged/route');
    expect($rootScope.$broadcast.callCount).toBe(0);
  });

  it('_dispatchRiggedNotifications emits one add-notification event with the correct message, stickiness and severity, when one notification is rigged to the correct route', function() {
    var notification;
    NotificationService.rigRouteNotification({
      message: testMessage,
      severity: testSeverity,
      sticky: true
    }, testRoute);

    NotificationService.rigRouteNotification({
      message: 'blah',
      severity: 'success'
    }, '/other/route');

    // event is not dispatched immediately
    expect($rootScope.$broadcast.callCount).toBe(0);

    NotificationService._dispatchRiggedNotifications(testRoute);
    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(testSeverity);
    expect(notification.sticky).toBe(true);
  });

  it('calling _dispatchRiggedNotifications multiple times does not dispatch any additional events', function() {
    var notification;
    NotificationService.rigRouteNotification({
      message: testMessage,
      severity: testSeverity,
      sticky: true
    }, testRoute);

    NotificationService.rigRouteNotification({
      message: 'blah',
      severity: 'success'
    }, '/other/route');

    // event is not dispatched immediately
    expect($rootScope.$broadcast.callCount).toBe(0);

    NotificationService._dispatchRiggedNotifications(testRoute);
    expect($rootScope.$broadcast.callCount).toBe(1);

    NotificationService._dispatchRiggedNotifications(testRoute);
    expect($rootScope.$broadcast.callCount).toBe(1);
  });

  it('_dispatchRiggedNotifications emits one add-notification event with the correct message, and default stickiness and severity, when one notification is rigged to the correct route', function() {
    var notification;
    NotificationService.rigRouteNotification({
      message: testMessage
    }, testRoute);

    // event is not dispatched immediately
    expect($rootScope.$broadcast.callCount).toBe(0);

    NotificationService._dispatchRiggedNotifications(testRoute);
    expect($rootScope.$broadcast.callCount).toBe(1);

    notification = nextNotification();
    expect(notification.message).toBe(testMessage);
    expect(notification.severity).toBe(defaultSeverity);
    expect(notification.sticky).toBe(false);
  });

});
