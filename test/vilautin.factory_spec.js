describe('vilautinService', function() {

  var Vilautin;
  var notifications;
  var $rootScope;
  var testStateName = 'testState';
  var notificationEvent = 'event:add-notification';

  beforeEach(angular.mock.module('vilautin'));

  beforeEach(angular.mock.inject(function(_$rootScope_, _Vilautin_) {
    $rootScope = _$rootScope_;
    Vilautin = _Vilautin_;
    notifications = [];
    spyOn($rootScope, '$broadcast').andCallThrough();
  }));

  afterEach(function() {
    $rootScope.$broadcast.reset();
  });

  describe('flash()', function() {
    describe('with string parameter', function() {
      beforeEach(function() {
        Vilautin.flash('Hello World!');
      });

      it('should trigger notification event', function() {
        expect($rootScope.$broadcast.callCount).toBe(1);
        expect($rootScope.$broadcast.mostRecentCall.args[0]).toBe(notificationEvent);
      });

      describe('notification parameters', function() {
        var notification;
        beforeEach(function() {
          notification = $rootScope.$broadcast.mostRecentCall.args[1];
        });

        it('should have a correct message property', function() {
          expect(notification.message).toBe('Hello World!');
        });

        it('should have default severity', function() {
          expect(notification.severity).toBe('info');
        });

        it('should have default sticky value', function() {
          expect(notification.sticky).toBe(false);
        });
      });
    });

    describe('with object parameter', function() {
      describe('without stateName property and sticky value', function() {
        beforeEach(function() {
          Vilautin.flash({
            message: 'Hello World!',
            severity: 'warning'
          });
        });

        it('should trigger notification event', function() {
          expect($rootScope.$broadcast.callCount).toBe(1);
          expect($rootScope.$broadcast.mostRecentCall.args[0]).toBe(notificationEvent);
        });

        describe('notification parameters', function() {
          var notification;
          beforeEach(function() {
            notification = $rootScope.$broadcast.mostRecentCall.args[1];
          });

          it('should have a correct message property', function() {
            expect(notification.message).toBe('Hello World!');
          });

          it('should have given severity', function() {
            expect(notification.severity).toBe('warning');
          });

          it('should have default sticky value', function() {
            expect(notification.sticky).toBe(false);
          });
        });
      });

      describe('without stateName property but with sticky value', function() {
        beforeEach(function() {
          Vilautin.flash({
            message: 'Hello World!',
            severity: 'warning',
            sticky: true
          });
        });

        it('should trigger notification event', function() {
            expect($rootScope.$broadcast.callCount).toBe(1);
            expect($rootScope.$broadcast.mostRecentCall.args[0]).toBe(notificationEvent);
          });

        describe('notification parameters', function() {
            var notification;
            beforeEach(function() {
              notification = $rootScope.$broadcast.mostRecentCall.args[1];
            });

            it('should have a correct message property', function() {
              expect(notification.message).toBe('Hello World!');
            });

            it('should have given severity', function() {
              expect(notification.severity).toBe('warning');
            });

            it('should have given sticky value', function() {
              expect(notification.sticky).toBe(true);
            });
          });
      });

      describe('with stateName property', function() {
        beforeEach(function() {
          Vilautin.flash({
            message: 'Hello World!',
            severity: 'warning',
            sticky: true,
            stateName: testStateName
          });
        });

        it('should not trigger notification event straight away', function() {
          expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });

        describe('on state change', function() {

          describe('to state where notification should not show up', function() {
            beforeEach(function() {
              $rootScope.$broadcast('$stateChangeSuccess', {name: 'otherState'});
            });

            it('should not trigger notification event', function() {
              expect($rootScope.$broadcast.callCount).toBe(1);
              expect($rootScope.$broadcast.mostRecentCall.args[0]).not.toBe(notificationEvent);
            });
          });

          describe('to state where notification should be shown', function() {
            beforeEach(function() {
              $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
            });

            it('should show the notification', function() {
              expect($rootScope.$broadcast.callCount).toBe(2);
              var broadCastArgs = $rootScope.$broadcast.mostRecentCall.args;
              expect(broadCastArgs[0]).toBe(notificationEvent);
              expect(broadCastArgs[1].message).toBe('Hello World!');
            });

            describe('navigating to the new state again', function() {
              beforeEach(function() {
                $rootScope.$broadcast.reset();
                $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
              });

              it('should not show any new notifications', function() {
                expect($rootScope.$broadcast.callCount).toBe(1);
                expect($rootScope.$broadcast.mostRecentCall.args[0]).not.toBe(notificationEvent);
              });
            });
          });

          describe('when there is multiple notifications', function() {
            describe('and all of them are rigged to the new state', function() {
              beforeEach(function() {
                Vilautin.flash({message: 'Hello World 2!', stateName: testStateName});
                $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
              });

              it('should show both notifications', function() {
                expect($rootScope.$broadcast.callCount).toBe(3);
                var firstBroadcastArgs = $rootScope.$broadcast.calls[1].args;
                var secondBroadcastArgs = $rootScope.$broadcast.calls[2].args;
                expect(firstBroadcastArgs[0]).toBe(notificationEvent);
                expect(secondBroadcastArgs[0]).toBe(notificationEvent);
                expect(firstBroadcastArgs[1].message).toBe('Hello World 2!');
                expect(secondBroadcastArgs[1].message).toBe('Hello World!');
              });
            });

            describe('and only one is rigged to the new state', function() {
              beforeEach(function() {
                $rootScope.$broadcast.reset();
                Vilautin.flash({message: 'Hello World 2!', stateName: 'otherState'});
                $rootScope.$broadcast('$stateChangeSuccess', {name: testStateName});
              });

              it('should show only one notifications', function() {
                expect($rootScope.$broadcast.callCount).toBe(2);
                var args = $rootScope.$broadcast.mostRecentCall.args;
                expect(args[0]).toBe(notificationEvent);
                expect(args[1].message).toBe('Hello World!');
              });
            });
          });
        });
      });
    });
  });
});
