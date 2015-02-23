'use strict';

angular.module('britney', []);

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
    if (VALID_SEVERITIES.indexOf(notification.severity) === -1) {
      delete notification.severity;
    }
    notification = angular.extend({}, notificationDefaults, notification);
    notification.id = getUniqueId('notification_');
    $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
  }

  function showFlashNotification(notification) {
    sendNotification(pickNotificationAttributes(notification));
  }

  function showStickyNotification(notification) {
    var filteredNotification = pickNotificationAttributes(notification);
    angular.extend(filteredNotification, stickyDefaults);
    sendNotification(filteredNotification);
  }

  function rigRouteNotification(notification, route) {
    riggedNotifications.push([route, pickNotificationAttributes(notification)]);
  }

  function pickNotificationAttributes(notification) {
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

  var uniqueIdCounter = 0;
  function getUniqueId(prefix) {
    return prefix + uniqueIdCounter++;
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

'use strict';

angular.module('britney')
  .controller('FlasherCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    var NOTIFICATION_SHOW_TIME = 5000; // 5 seconds

    function removeNotification(id) {
      delete $scope.notifications[id];
    }

    function isValidNotification(notification) {
      function isValidNotificationId() {
        return angular.isString(notification.id) &&
          notification.id.indexOf('notification_') === 0;
      }

      return isValidNotificationId() &&
             angular.isString(notification.message) &&
             angular.isString(notification.severity) &&
             typeof notification.sticky === 'boolean';
    }

    function appendNotification(event, notification) {
      var id = notification.id;

      if (isValidNotification(notification)) {
        $scope.notifications[id] = notification;

        if (!notification.sticky) {

          $timeout(function() {
            removeNotification(id);
          }, NOTIFICATION_SHOW_TIME);

        }
      }
    }

    function emptyNotifications() {
      $scope.notifications = {};
    }

    $scope.notifications = {};
    $scope.removeNotification = removeNotification;

    $rootScope.$on('event:add-notification', appendNotification);

    $rootScope.$on('$stateChangeStart', emptyNotifications);
  }]);

'use strict';
angular.module('britney')
  .directive('britneyFlasher', function () {
    return {
      template: '<div class="britney-notifications" ng-controller="FlasherCtrl"><div ng-repeat="(id, notification) in notifications" class="notification {{notification.severity}}" ng-click="removeNotification(id)"><span class="message">{{ notification.message }}</span></div></div>',
      restrict: 'E',
      replace: true
    };
  });
