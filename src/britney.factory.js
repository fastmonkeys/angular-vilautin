(function() {
  'use strict';
  angular
    .module('britney')
    .factory('Britney', ['$rootScope', 'NOTIFICATION_EVENT', 'SEVERITIES', BritneyService]);

  function BritneyService($rootScope, NOTIFICATION_EVENT, SEVERITIES) {
    var riggedNotifications = [];
    var uniqueIdCounter = 0;
    var stickyDefaults = {
      sticky: true
    };
    var notificationDefaults = {
      sticky: false,
      severity: 'info'
    };

    startListeningStateChange();

    return {
      showFlashNotification: showFlashNotification,
      showStickyNotification: showStickyNotification,
      rigRouteNotification: rigRouteNotification
    };

    function startListeningStateChange() {
      $rootScope.$on('$stateChangeSuccess', dispatchRiggedNotificationForState);

      function dispatchRiggedNotificationForState(event, next) {
        dispatchRiggedNotifications(next.name);
      }
    }

    function showFlashNotification(notification) {
      sendNotification(pickNotificationProperties(notification));
    }

    function showStickyNotification(notification) {
      var filteredProperties = pickNotificationProperties(notification);
      angular.extend(filteredProperties, stickyDefaults);
      sendNotification(filteredProperties);
    }

    function rigRouteNotification(notification, route) {
      riggedNotifications.push([route, pickNotificationProperties(notification)]);
    }

    function dispatchRiggedNotifications(route) {
      var combo, rigging, notification;
      while (riggedNotifications.length > 0) {
        combo = riggedNotifications.pop();
        rigging = combo[0];
        notification = combo[1];

        if (rigging !== route) { continue; }
        sendNotification(notification);
      }
    }

    function sendNotification(notification) {
      if (SEVERITIES.indexOf(notification.severity) === -1) {
        delete notification.severity;
      }
      notification = angular.extend({}, notificationDefaults, notification);
      notification.id = createUniqueId('notification_');
      $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
    }

    function pickNotificationProperties(notification) {
      var filteredNotification = {};

      if(notification.message) {
        filteredNotification.message = notification.message;
      }
      if(notification.severity) {
        filteredNotification.severity = notification.severity;
      }
      if(notification.sticky) {
        filteredNotification.sticky = notification.sticky;
      }

      return filteredNotification;
    }

    function createUniqueId(prefix) {
      return prefix + uniqueIdCounter++;
    }
  }
})();
