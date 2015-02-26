(function() {
  'use strict';
  angular
    .module('britney')
    .constant('DOC_URL', 'https://github.com/fastmonkeys/britney')
    .constant('NOTIFICATION_EVENT', 'event:add-notification')
    .constant('SEVERITIES', ['info', 'success', 'warning'])
    .constant('NOTIFICATION_SHOW_TIME', 5000);
})();
