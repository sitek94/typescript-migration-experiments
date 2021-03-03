"use strict";
var CoinCounter;
(function (CoinCounter) {
    var CoinCounterViewModel = /** @class */ (function () {
        function CoinCounterViewModel() {
            var _this = this;
            this.highScoreList = ko.observableArray(CoinCounter.app.starterHighScoreList);
            this.gameClock = new CoinCounter.GameClock(CoinCounter.app.gameLengthInSeconds, this.handleGameClockElapsed);
            this.statusMessage = ko.observable('');
            this.statusMessageVisible = ko.observable(false);
            this.isPaused = ko.computed(function () {
                return (!_this.gameClock.isRunning() &&
                    _this.gameClock.secondsRemaining() > 0 &&
                    !_this.statusMessageVisible());
            });
            this.canBePaused = ko.computed(function () {
                return (_this.gameClock.isRunning() &&
                    _this.gameClock.secondsRemaining() > 0 &&
                    !_this.statusMessageVisible());
            });
            this.playerName = ko.observable('');
            this.playerNameQuestion = ko.observable('');
            this.coins = CoinCounter.coins;
            this.app = CoinCounter.app;
            this.score = ko.observable(0);
            this.scoreText = ko.computed(function () {
                return _this.playerName() === ''
                    ? 'Score: ' + _this.score()
                    : _this.playerName() + "'s score: " + _this.score();
            });
            this.buttonsEnabled = ko.computed(function () {
                return !_this.isPaused() && _this.gameClock.isRunning();
            });
            this.goalAmount = ko.observable(null);
            this.endOfGameVisible = ko.observable(false);
            this.endOfGameMessage = ko.observable('');
            this.visiblePage = ko.observable('game');
            this.gameVisible = ko.computed(function () {
                return _this.visiblePage() === 'game';
            });
            this.highScoreVisible = ko.computed(function () {
                return _this.visiblePage() === 'highscore';
            });
            this.aboutVisible = ko.computed(function () {
                return _this.visiblePage() === 'about';
            });
            this.newGameButtonClass = ko.computed(function () {
                if (_this.gameVisible()) {
                    return 'active';
                }
                return '';
            });
            this.aboutButtonClass = ko.computed(function () {
                if (_this.aboutVisible()) {
                    return 'active';
                }
                return '';
            });
            this.newGameButtonText = ko.computed(function () {
                if (_this.visiblePage() !== 'game') {
                    return 'Game';
                }
                return 'New Game';
            });
        }
        CoinCounterViewModel.prototype.handleGameClockElapsed = function () {
            var highScoreIndex = this.tryPushHighScore({
                name: this.playerName(),
                score: this.score(),
            });
            var message = 'Your score was ' + this.score() + '.';
            if (highScoreIndex === 0) {
                message += "<br />That's the high score!";
            }
            else if (highScoreIndex !== -1) {
                message +=
                    "<br />That's good for #" +
                        (highScoreIndex + 1) +
                        ' on the high score list!';
            }
            this.endOfGameMessage(message);
            $('#gameOverModal').modal('show');
        };
        CoinCounterViewModel.prototype.tryPushHighScore = function (theScore) {
            var hsl = this.highScoreList();
            if (theScore.score === 0) {
                return -1;
            }
            if (!theScore.name) {
                theScore.name = 'No name';
            }
            if (hsl.length === 0) {
                this.highScoreList.push(theScore);
                return 0;
            }
            for (var i = 0; i < this.highScoreList().length; i += 1) {
                if (hsl[i].score < theScore.score) {
                    hsl.splice(i, 0, theScore);
                    if (hsl.length > CoinCounter.app.maxHighScoreItems) {
                        hsl.length = CoinCounter.app.maxHighScoreItems;
                    }
                    this.highScoreList(hsl);
                    return i;
                }
            }
            return -1;
        };
        CoinCounterViewModel.prototype.pauseGame = function () {
            this.gameClock.stop();
        };
        CoinCounterViewModel.prototype.resumeGame = function () {
            this.gameClock.start();
        };
        CoinCounterViewModel.prototype.imageElementName = function (coinName, zeroBasedIndex) {
            return 'img' + CoinCounter.spacesToUnderscore(coinName) + String(zeroBasedIndex);
        };
        CoinCounterViewModel.prototype.addCoin = function (coin) {
            if (coin.count() === coin.max()) {
                return;
            }
            var oldCoinCount = coin.count();
            coin.count(coin.count() + 1);
            var newCoin = document.createElement('img');
            newCoin.src = CoinCounter.app.imagePath + '/' + coin.imgSrc;
            newCoin.id = this.imageElementName(coin.name, oldCoinCount);
            newCoin.classList.add(coin.style);
            var destinationDiv = document.getElementById(this.destinationDivIDForCoin(coin));
            destinationDiv === null || destinationDiv === void 0 ? void 0 : destinationDiv.appendChild(newCoin);
        };
        CoinCounterViewModel.prototype.destinationDivIDForCoin = function (coin) {
            return 'draw' + CoinCounter.spacesToUnderscore(coin.name);
        };
        CoinCounterViewModel.prototype.removeCoin = function (coin) {
            var _a;
            if (coin.count() === 0) {
                return;
            }
            coin.count(coin.count() - 1);
            var coinToRemove = document.getElementById(this.imageElementName(coin.name, coin.count()));
            (_a = coinToRemove === null || coinToRemove === void 0 ? void 0 : coinToRemove.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(coinToRemove);
        };
        CoinCounterViewModel.prototype.whatTheUserShouldBeDoing = function () {
            if (this && this.goalAmount) {
                var ga = this.goalAmount();
                if (ga !== null && ga.toFixed) {
                    return ('Try to make ' +
                        ga.times(100).toString() +
                        ' cent' +
                        (ga.eq(Big('0.01')) ? '' : 's') +
                        '.');
                }
            }
            return '';
        };
        CoinCounterViewModel.prototype.calculateTotal = function () {
            var total = Big(0);
            this.coins.forEach(function (coin) {
                total = total.plus(coin.value.times(coin.count()));
            });
            return total;
        };
        CoinCounterViewModel.prototype.checkForVictory = function () {
            var _this = this;
            var message;
            if (this.calculateTotal().eq(this.goalAmount())) {
                this.gameClock.stop();
                this.score(this.score() + CoinCounter.app.pointsForCorrect);
                var coinsUsed = 0, bonusSeconds = 0;
                for (var i = 0; i < CoinCounter.coins.length; i += 1) {
                    if (CoinCounter.coins[i].count() > 0) {
                        coinsUsed += 1;
                    }
                }
                bonusSeconds = coinsUsed * CoinCounter.app.bonusSecondsForCorrectPerCoin;
                this.gameClock.addSeconds(bonusSeconds);
                message =
                    'Correct!<br />+' +
                        CoinCounter.app.pointsForCorrect +
                        ' points, +' +
                        bonusSeconds +
                        ' sec for coins used.';
                this.showStatusMessage(message, CoinCounter.app.msTimeoutAfterCorrect, function () {
                    $('#splash').removeClass('correct');
                    _this.startNewGame();
                });
                $('#splash').addClass('correct');
            }
            else {
                this.score(this.score() - CoinCounter.app.pointsForIncorrect);
                message = 'Incorrect.<br />-' + CoinCounter.app.pointsForIncorrect + ' points.';
                this.showStatusMessage(message, CoinCounter.app.msTimeoutAfterIncorrect, function () {
                    $('#splash').removeClass('flyIn');
                });
                $('#splash').addClass('flyIn');
            }
        };
        CoinCounterViewModel.prototype.startNewGame = function () {
            this.clearStatusMessage();
            this.clearCoins();
            var goalAmount = Math.floor(Math.random() * 100 + 1) / 100;
            this.goalAmount(Big(goalAmount.toFixed(2)));
            this.gameClock.start();
        };
        CoinCounterViewModel.prototype.startBrandNewGame = function () {
            this.visiblePage('game');
            this.playerNameQuestion('Enter player name:');
            $('#gameOverModal').modal('hide');
            $('#nameModal').modal('show');
        };
        CoinCounterViewModel.prototype.showStatusMessage = function (message, timeout, callback) {
            var _this = this;
            this.statusMessage(message);
            this.statusMessageVisible(true);
            setTimeout(function () {
                _this.clearStatusMessage();
                if (callback) {
                    callback(_this);
                }
            }, timeout);
        };
        CoinCounterViewModel.prototype.clearStatusMessage = function () {
            this.statusMessage('');
            this.statusMessageVisible(false);
        };
        CoinCounterViewModel.prototype.clearCoins = function () {
            for (var coinIndex = 0; coinIndex < CoinCounter.coins.length; coinIndex += 1) {
                var coin = CoinCounter.coins[coinIndex];
                coin.count(0);
                var div = document.getElementById('draw' + CoinCounter.spacesToUnderscore(coin.name));
                while (div && div.lastChild) {
                    div.removeChild(div.lastChild);
                }
            }
        };
        CoinCounterViewModel.prototype.setGameVisible = function () {
            if (this.visiblePage() === 'game') {
                this.startBrandNewGame();
            }
            this.visiblePage('game');
        };
        CoinCounterViewModel.prototype.setAboutPageVisible = function () {
            this.pauseGame();
            this.visiblePage('about');
        };
        CoinCounterViewModel.prototype.setHighScoreVisible = function () {
            this.pauseGame();
            this.visiblePage('highscore');
        };
        CoinCounterViewModel.prototype.unitTestsButtonClick = function () {
            if (!this.isPaused()) {
                this.pauseGame();
            }
            var response = confirm('Do you want to run the unit tests?\nThis will cancel any current game and forget your high scores.');
            if (response) {
                window.location.href = 'tests/tests.html';
            }
        };
        CoinCounterViewModel.prototype.addCoinEnabled = function (coin) {
            return this.buttonsEnabled() && coin.canAddMore();
        };
        CoinCounterViewModel.prototype.removeCoinEnabled = function (coin) {
            return this.buttonsEnabled() && coin.canTakeAway();
        };
        CoinCounterViewModel.prototype.initialize = function () {
            var _this = this;
            $('#nameModal')
                .on('shown.bs.modal', function () {
                setTimeout(function () {
                    $('#playerNameInput').focus();
                }, 100);
            })
                .on('hidden.bs.modal', function () {
                _this.startNewGame();
                _this.score(0);
                _this.gameClock.reset();
                _this.gameClock.start();
            });
            $('#playerNameInput').bind('keypress', function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    $('#playerNameOK').trigger('click');
                }
            });
            this.startBrandNewGame();
        };
        return CoinCounterViewModel;
    }());
    CoinCounter.CoinCounterViewModel = CoinCounterViewModel;
})(CoinCounter || (CoinCounter = {}));
