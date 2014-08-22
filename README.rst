Britney Flasher
================
AngularJS powered flash notification service for easily showing flash notifications.

Installation
-----------

Installing latest version of Britney::

    $ bower install --save git@github.com:fastmonkeys/bower-britney.git#0.0.1


Setting up the module
----------
After installing the package you must add the following snippet to your index.html

	...
	<body ng-app>
	...
		<!--  Interesting stuff -->
		<div class="britney-notifications" ng-controller="FlasherCtrl" ng-cloak>
	      <div ng-repeat="(id, notification) in notifications" class="notification {{notification.severity}}"
	        ng-click="removeNotification(id)">
	        <span class="message">{{ notification.message }}</span>
	      </div>
	    </div>
	    <!-- End of interesting stuff -->

	    <div class="app-container" ui-view></div>
	...
	</body>


And make sure that the module `britney` is defined as your app's dependency.

	angular.module('yourAwesomeApp', ['britney']);


You need also import styles from `bower_components/britney/dist/` in order to see the notifications properly.


Usage
----------
In order to show notifications, inject `Flasher` to our module and call its functions

	angular.module('yourAwesomeApp').controller('SomeCtrl', ['Flasher', function(Flasher) {
		Flasher.showFlashNotification(<notification>);
		Flasher.showStickyNotification(<notification>);	
		Flasher.rigRouteNotification(<notification>, <nextStateName>);
	}]);
	