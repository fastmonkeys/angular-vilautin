'use strict';

angular.module('britney').factory('Flasher', ['$rootScope', function($rootScope) {
  var NOTIFICATION_EVENT = 'event:add-notification',
    VALID_SEVERITIES = ['info', 'success', 'warning'],

    stickyDefaults = {
      sticky: true
    },
    notificationDefaults = {
      sticky: false,
      severity: 'info'
    },

    riggedNotifications = [];

  function sendNotification(notification) {
    if (!_.contains(VALID_SEVERITIES, notification.severity)) {
      delete notification.severity;
    }
    notification = _.extend({}, notificationDefaults, notification);
    notification.id = _.uniqueId('notification_');
    $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
  }

  function showFlashNotification(notification) {
    notification = _.pick(notification, 'message', 'severity');
    sendNotification(notification);
  }

  function showStickyNotification(notification) {
    notification = _.pick(notification, 'message', 'severity');
    _.extend(notification, stickyDefaults);
    sendNotification(notification);
  }

  function rigRouteNotification(notification, route) {
    notification = _.pick(notification, 'message', 'severity', 'sticky');
    riggedNotifications.push([route, notification]);
  }

  function _dispatchRiggedNotifications(route) {
    var combo, rigging, notification;
    while (riggedNotifications.length > 0) {
      combo = riggedNotifications.pop();
      rigging = combo[0];
      notification = combo[1];

      if (rigging !== route) { continue; }
      sendNotification(notification);
    }
  }

  return {
    showFlashNotification: showFlashNotification,
    showStickyNotification: showStickyNotification,
    rigRouteNotification: rigRouteNotification,
    _dispatchRiggedNotifications:_dispatchRiggedNotifications
  };
}])
.run(['$rootScope', 'Flasher', function($rootScope, Flasher) {

  // when a route changes, dispatch notifications rigged to the current route
  $rootScope.$on('$stateChangeSuccess', function(event, next) {
    Flasher._dispatchRiggedNotifications(next.name);
  });
}]);
