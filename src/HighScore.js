"use strict";
var CoinCounter;
(function (CoinCounter) {
    var HighScoreList = /** @class */ (function () {
        function HighScoreList() {
            this.starterList = [
                { name: 'x', score: 29 },
                { name: 'Bob', score: 19 },
                { name: 'Charlie', score: 9 },
            ];
            this.List = ko.observableArray(this.starterList);
        }
        HighScoreList.prototype.tryPushHighScore = function (theScore) {
            var hsl = this.List();
            if (theScore.score === 0) {
                return -1;
            }
            if (!theScore.name) {
                theScore.name = 'No name';
            }
            if (hsl.length === 0) {
                this.List.push(theScore);
                return 0;
            }
            for (var i = 0; i < this.List().length; i += 1) {
                if (hsl[i].score < theScore.score) {
                    hsl.splice(i, 0, theScore);
                    if (hsl.length > CoinCounter.app.maxHighScoreItems) {
                        hsl.length = CoinCounter.app.maxHighScoreItems;
                    }
                    this.List(hsl);
                    return i;
                }
            }
            return -1;
        };
        return HighScoreList;
    }());
    CoinCounter.HighScoreList = HighScoreList;
})(CoinCounter || (CoinCounter = {}));
