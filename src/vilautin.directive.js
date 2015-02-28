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
      controller: 'VilautinController',
      controllerAs: 'ctrl'
    };
  });
