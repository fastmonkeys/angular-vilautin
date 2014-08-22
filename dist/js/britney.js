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

'use strict';

angular.module('britney')
  .controller('FlasherCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    var NOTIFICATION_SHOW_TIME = 5000; // 5 seconds

    function removeNotification(id) {
      delete $scope.notifications[id];
    }

    function isValidNotification(notification) {
      function isValidNotificationId() {
        return _.isString(notification.id) &&
          notification.id.indexOf('notification_') === 0;
      }

      return isValidNotificationId() &&
             _.isString(notification.message) &&
             _.isString(notification.severity) &&
             _.isBoolean(notification.sticky);
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
