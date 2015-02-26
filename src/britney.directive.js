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
