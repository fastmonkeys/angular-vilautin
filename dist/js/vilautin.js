(function() {
  'use strict';
  angular
    .module('vilautin', []);
})();

(function() {
  'use strict';
  angular
    .module('vilautin')
    .factory('Vilautin', BritneyService);

  function BritneyService($rootScope, NOTIFICATION_EVENT, SEVERITIES) {
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
  BritneyService.$inject = ["$rootScope", "NOTIFICATION_EVENT", "SEVERITIES"];
})();

(function() {
  'use strict';

angular
  .module('vilautin')
  .controller('VilautinController', BritneyController);

    function BritneyController($rootScope, $window, DOC_URL, NOTIFICATION_SHOW_TIME) {
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
    BritneyController.$inject = ["$rootScope", "$window", "DOC_URL", "NOTIFICATION_SHOW_TIME"];
})();

'use strict';
angular.module('vilautin')
  .directive('vilautinNotifications', function () {
    return {
      template:
        '<div ' +
          'ng-repeat="(id, notification) in ctrl.notifications" ' +
          'class="notification {{notification.severity}}" ' +
          'ng-click="ctrl.removeNotification(id)">' +
            '<span class="message">{{ notification.message }}</span>' +
        '</div>',
      restrict: 'E',
      controller: 'VilautinController',
      controllerAs: 'ctrl'
    };
  });
