'use strict';
angular.module('britney')
  .directive('britneyFlasher', function () {
    return {
      template: '<div class="britney-notifications" ng-controller="FlasherCtrl"><div ng-repeat="(id, notification) in notifications" class="notification {{notification.severity}}" ng-click="removeNotification(id)"><span class="message">{{ notification.message }}</span></div></div>',
      restrict: 'E',
      replace: true
    };
  });
