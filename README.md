Britney
================

[![Circle CI](https://circleci.com/gh/fastmonkeys/britney.svg?style=svg&circle-token=67f1b2286f7cd5f67907e2bf8b9251f816eccac5)](https://circleci.com/gh/fastmonkeys/britney)

AngularJS powered flash notification service for easily showing flash notifications.

Dependencies
-----
- AngularJS 1.3.*
- [UI router](https://github.com/angular-ui/ui-router) (if you want to use `Britney.flash` with `stateName` param)

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
      message: 'Notication object for more control over notification',
      severity: 'warning',
      sticky: true
    };
    Britney.flash(notificationObj);
    Britney.flash('Flash a notification with default params like this!');
});
```

###Functions

- `flash(messageString)`: shows a flash notification immediately with default parameters
- `flash(notificationObj)`: shows flash notification according to the `notificationObj`

###Notification object
Notification object that is passed to function `flash()` and it can have the following properties.

```js
var notificationObj = {
  message: 'This text is shown in the notification',
  
  // String ['info', 'success', 'warning'] that defines notification styling
  severity: 'warning', // default: 'info'
  
  // Boolean value defining whether the notification is sticky and doesn't
  // remove itself
  sticky: true, // default: false
  
  // String ui-router state name. This is used for showing notification
  // right after state has changed. Must be called in the previous state
  stateName: 'loginState' // assumes ui-router is loaded already
}
```
