Britney Flasher
================

[![Circle CI](https://circleci.com/gh/fastmonkeys/britney.svg?style=svg&circle-token=67f1b2286f7cd5f67907e2bf8b9251f816eccac5)](https://circleci.com/gh/fastmonkeys/britney)

AngularJS powered flash notification service for easily showing flash notifications.

Installation
-----------
```sh
$ bower install --save git@github.com:fastmonkeys/bower-britney.git#0.0.2
```

Setting up the module
----------
After installing the package you must add the following snippet to your index.html
```html
...
<body ng-app>
  <britney-flasher></britney-flasher>
  ...
</body>
```


And make sure that the module `britney` is defined as your app's dependency.
```js
// app.js

angular.module('yourAwesomeApp', ['britney']);
```


You need also import styles from `bower_components/britney/dist/` in order to see the notifications properly.


Usage
----------
In order to show notifications, inject `Flasher` to our module and call its functions

```js
angular.module('yourAwesomeApp').controller('SomeCtrl', ['Flasher', function(Flasher) {
  var notificationObj = {
    message: 'Please login in order to continue',
    severity: 'warning'
  };
  Flasher.showFlashNotification(notificationObj);
  Flasher.showStickyNotification(notificationObj);
  Flasher.rigRouteNotification(notificationObj, 'nextStateName');
}]);
```