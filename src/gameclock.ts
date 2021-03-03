module CoinCounter {
  export interface GameClock {
    new (
      initialTimeInSeconds?: number,
      callbackOnClockElapsed?: () => void,
    ): GameClock;
    start(): void;
    stop(): void;
    reset(): void;
    addSeconds(seconds: number): void;
    isRunning: KnockoutObservable<boolean>;
    secondsRemaining: KnockoutObservable<number>;
    timeRemainingFormatted: KnockoutComputed<string>;
  }

  export var GameClock: GameClock = <ClassFunction>(
    function (
      this: any,
      initialTimeInSeconds?: number,
      callbackOnClockElapsed?: () => void,
    ) {
      'use strict';
      var self: GameClock = this;
      var _initialTimeInSeconds = initialTimeInSeconds || 30;
      var _callbackOnClockElapsed = callbackOnClockElapsed;
      var intervalHandle: number;
      self.start = function () {
        if (!self.isRunning()) {
          self.isRunning(true);
          intervalHandle = setInterval(_tick, 1000);
        }
      };
      self.isRunning = ko.observable(false);
      self.secondsRemaining = ko.observable(_initialTimeInSeconds);
      self.timeRemainingFormatted = ko.computed(function () {
        var date = new Date();
        date.setSeconds(self.secondsRemaining());
        var result = date.toISOString().substr(14, 5);
        return result.replace(/^0+/, '');
      });
      var _tick = function () {
        if (self.isRunning()) {
          self.secondsRemaining(self.secondsRemaining() - 1);
          if (self.secondsRemaining() <= 0) {
            self.stop();
            self.secondsRemaining(0);
            if (
              _callbackOnClockElapsed &&
              typeof _callbackOnClockElapsed === 'function'
            ) {
              _callbackOnClockElapsed();
            }
          }
        }
      };
      self.stop = function () {
        self.isRunning(false);
        clearInterval(intervalHandle);
      };
      self.reset = function () {
        self.stop();
        self.secondsRemaining(_initialTimeInSeconds);
      };
      self.addSeconds = function (numberOfSeconds: number) {
        this.secondsRemaining(this.secondsRemaining() + numberOfSeconds);
      };
    }
  );
}
