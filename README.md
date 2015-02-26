Britney
================

[![Circle CI](https://circleci.com/gh/fastmonkeys/britney.svg?style=svg&circle-token=67f1b2286f7cd5f67907e2bf8b9251f816eccac5)](https://circleci.com/gh/fastmonkeys/britney)

AngularJS powered flash notification service for easily showing flash notifications.

Dependencies
-----
- AngularJS 1.3.*
- [UI router](https://github.com/angular-ui/ui-router) (if you want to use `Britney.rigRouteNotification`)

Installation
-----------
```
$ bower install --save git@github.com:fastmonkeys/britney.git
```

Setting up the module
----------
After installing the package you must add the following snippet to your index.html

```html
...
<body ng-app>
  <britney-notifications></britney-notifications>
  ...
</body>
```


And make sure that the module `britney` is defined as your app's dependency.

```js
// app.js

angular.module('yourAwesomeApp', ['britney']);
```

You need also import styles from `bower_components/britney/dist/` in order to see the notifications properly.


How to use Britney
----------
In order to show notifications, inject `Britney` to your module and call its functions

```js
angular
  .module('yourAwesomeApp')
  .controller('SomeCtrl', function(Britney) {
    var notificationObj = {
      message: 'Please login in order to continue',
      severity: 'warning'
    };
    Britney.showFlashNotification(notificationObj);
    Britney.showStickyNotification(notificationObj);
    Britney.rigRouteNotification(notificationObj, 'nextStateName');
});
```

###Functions

- `showFlashNotification(notificationObj)`: shows flash notification immediately and removes it after 5 seconds.

- `showStickyNotification(notificationObj)`: shows flash notification immediately and does not remove it automatically. The notification is removed when it is clicked.

- `rigRouteNotification(notificationObj, nextStateName)`: shows flash notification immediately after navigation has happened to `ui.router` state with name `nextStateName`. This is useful when you want to e.g. redirect user to some state and show flash notification immediately in the new state. (Assumes [UI router](https://github.com/angular-ui/ui-router) is loaded. If you don't use UI router, this function can't be used)

###Notification object
Notification object that is passed to functions `showFlashNotification()`, `showStickyNotification()` and `rigRouteNotification()` has the following properties.

```js
var notificationObj = {
  message: 'This text is shown in the notification',
  
  // String ['info', 'success', 'warning'] that defines notification styling
  severity: 'warning', // default: 'info'
  
  // Boolean value defining whether the notification is sticky and doesn't
  // remove itself
  sticky: true // default: false
}
```
