"use strict";
var CoinCounter;
(function (CoinCounter) {
    function spacesToUnderscore(inputString) {
        return inputString.replace(/ /g, '_');
    }
    CoinCounter.spacesToUnderscore = spacesToUnderscore;
})(CoinCounter || (CoinCounter = {}));
