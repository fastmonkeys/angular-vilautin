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
