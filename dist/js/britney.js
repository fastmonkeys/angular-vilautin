(function() {
  'use strict';
  angular
    .module('britney', []);
})();

(function() {
  'use strict';
  angular
    .module('britney')
    .factory('Britney', BritneyService);

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
  BritneyService.$inject = ["$rootScope", "NOTIFICATION_EVENT", "SEVERITIES"];
})();

(function() {
  'use strict';

angular
  .module('britney')
  .controller('BritneyController', BritneyController);

    function BritneyController($rootScope, $timeout, DOC_URL, NOTIFICATION_SHOW_TIME) {
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
          $timeout(function() {
            removeNotification(id);
          }, NOTIFICATION_SHOW_TIME);
        }
      }

      function emptyNotifications() {
        vm.notifications = {};
      }

      function validateNotification(notification) {
        var isValidNotificationMessage = angular.isString(notification.message);
        var isValidNotificationSeverity = angular.isString(notification.severity);
        var isValidStickyProperty = typeof notification.sticky === 'boolean';

        if (!isValidNotificationMessage) {
          throw new Error('(Britney) notification message must be a String. Please read docs at ' + DOC_URL);
        }
        if (!isValidNotificationSeverity) {
          throw new Error('(Britney) notification severity value is not supported. Please read docs at ' + DOC_URL);
        }
        if(!isValidStickyProperty) {
          throw new Error('(Britney) notification sticky value must be a Boolean. Please read docs at ' + DOC_URL);
        }
      }
    }
    BritneyController.$inject = ["$rootScope", "$timeout", "DOC_URL", "NOTIFICATION_SHOW_TIME"];
})();

'use strict';
angular.module('britney')
  .directive('britneyNotifications', function () {
    return {
      template:
      '<div class="britney-notifications">' +
        '<div ' +
          'ng-repeat="(id, notification) in ctrl.notifications" ' +
          'class="notification {{notification.severity}}" ' +
          'ng-click="ctrl.removeNotification(id)">' +
            '<span class="message">{{ notification.message }}</span>' +
        '</div>' +
      '</div>',
      restrict: 'E',
      controller: 'BritneyController',
      controllerAs: 'ctrl'
    };
  });
