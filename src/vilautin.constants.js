(function() {
  'use strict';
  angular
    .module('vilautin')
    .constant('DOC_URL', 'https://github.com/fastmonkeys/vilautin')
    .constant('NOTIFICATION_EVENT', 'event:add-notification')
    .constant('SEVERITIES', ['info', 'success', 'warning'])
    .constant('NOTIFICATION_SHOW_TIME', 5000);
})();
