(function() {
  'use strict';

angular
  .module('vilautin')
  .controller('VilautinController', VilautinController);

    function VilautinController($rootScope, $window, DOC_URL, NOTIFICATION_SHOW_TIME) {
      var vm = this;
      vm.notifications = {};
      vm.removeNotification = removeNotification;
      activate();

      function activate() {
        $rootScope.$on('event:add-notification', appendNotification);
        $rootScope.$on('$stateChangeStart', emptyNotifications);
      }

      function removeNotification(id) {
        delete vm.notifications[id];
      }

      function appendNotification(event, notification) {
        validateNotification(notification);
        var id = notification.id;
        vm.notifications[id] = notification;
        if (!notification.sticky) {
          $window.setTimeout(function() {
            removeNotification(id);
            $rootScope.$apply();
          }, NOTIFICATION_SHOW_TIME);
        }
      }

      function emptyNotifications() {
        vm.notifications = {};
      }

      function validateNotification(notification) {
        if (angular.isString(notification)) {
          return;
        }
        var isValidNotificationMessage = angular.isString(notification.message);
        var isValidNotificationSeverity = angular.isString(notification.severity);
        var isValidStickyProperty = typeof notification.sticky === 'boolean';

        if (!isValidNotificationMessage) {
          throw new Error('(Vilautin) notification message must be a String. Please read docs at ' + DOC_URL);
        }
        if (!isValidNotificationSeverity) {
          throw new Error('(Vilautin) notification severity value is not supported. Please read docs at ' + DOC_URL);
        }
        if(!isValidStickyProperty) {
          throw new Error('(Vilautin) notification sticky value must be a Boolean. Please read docs at ' + DOC_URL);
        }
      }
    }
})();
