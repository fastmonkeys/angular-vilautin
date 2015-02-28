(function() {
  'use strict';
  angular
    .module('vilautin')
    .factory('Vilautin', VilautinService);

  function VilautinService($rootScope, NOTIFICATION_EVENT, SEVERITIES) {
    var riggedNotifications = [];
    var uniqueIdCounter = 0;
    var notificationDefaults = {
      sticky: false,
      severity: 'info'
    };

    startListeningStateChange();

    return {
      flash: flash
    };

    function flash(notification) {
      if (angular.isString(notification)) {
        showFlashNotification({message: notification});
      } else if (notification.stateName) {
        var stateName = notification.stateName;
        delete notification.stateName;
        rigRouteNotification(notification, stateName);
      } else {
        showFlashNotification(notification);
      }
    }

    function startListeningStateChange() {
      $rootScope.$on('$stateChangeSuccess', dispatchRiggedNotificationForState);

      function dispatchRiggedNotificationForState(event, next) {
        dispatchRiggedNotifications(next.name);
      }
    }

    function showFlashNotification(notification) {
      var pickedProperties = pickNotificationProperties(notification);
      sendNotification(angular.extend({}, notificationDefaults, pickedProperties));
    }

    function rigRouteNotification(notification, route) {
      var pickedProperties = pickNotificationProperties(notification);
      riggedNotifications.push([route, angular.extend({}, notificationDefaults, pickedProperties)]);
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
