﻿if (QUnit) {

    QUnit.module("Game Tests", {
        beforeEach: function() {
            // prepare something for all following tests
            var tempContainer = document.createElement("div");
            tempContainer.id = "tempContainer";
            tempContainer.style.cssText = "display:none;";
            document.body.appendChild(tempContainer);
        },
        afterEach: function() {
            // clean up after each test
            var container = document.getElementById("tempContainer");
            container?.parentElement?.removeChild(container);
        }
    });

    QUnit.test("Tests run.", function (assert) {
        assert.ok(1 === 1, "Tests are running.");
    });

    QUnit.test("Can create CoinCounter View Model and defaults are as expected", function (assert) {

        var ccvm = new CoinCounter.CoinCounterViewModel(),
            hsl = ccvm.highScoreList;

        assert.ok(!!ccvm, "expected CoinCounterViewModel variable to be instantiated.");
        assert.ok(hsl.List().length > 0, "expected a non-empty array");
        assert.ok(hsl instanceof CoinCounter.HighScoreList, "expected a HighScoreList");
        assert.ok(!!ccvm.gameClock, "expected an instantiated game clock");
        assert.ok(!!ccvm.coins, "expected instantiated coins");
        assert.ok(!!ccvm.app, "expected an instantiated app");

    });

    QUnit.test("Can add and remove a coin to DOM", function (assert) {

        var ccvm = new CoinCounter.CoinCounterViewModel(),
            coin = CoinCounter.coins[0],
            tempContainer = document.getElementById("tempContainer");

        var coinDiv = document.createElement("div");
        coinDiv.id = ccvm.destinationDivIDForCoin(coin);
        tempContainer?.appendChild(coinDiv);

        assert.strictEqual(coinDiv.childElementCount, 0, "expected no children.");
        ccvm.addCoin(coin);
        assert.strictEqual(coinDiv.childElementCount, 1, "expected one child.");
        ccvm.removeCoin(coin);
        assert.strictEqual(coinDiv.childElementCount, 0, "expected no children again.");

    });

    QUnit.test("Proper pluralization of goal", function (assert) {
        var ccvm = new CoinCounter.CoinCounterViewModel();
        ccvm.goalAmount(Big("0.01"));
        assert.strictEqual(ccvm.whatTheUserShouldBeDoing(), "Try to make 1 cent.", "expected singular");

        ccvm.goalAmount(Big("0.02"));
        assert.strictEqual(ccvm.whatTheUserShouldBeDoing(), "Try to make 2 cents.", "expected plural");
    });

}