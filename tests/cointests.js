"use strict";
if (QUnit) {
    QUnit.module('Coin Tests', {});
    QUnit.test('Tests run.', function (assert) {
        assert.ok(1 === 1, 'Tests are running.');
    });
    QUnit.test("Can't remove when zero.", function (assert) {
        var coin = new CoinCounter.Coin('test', 'test', Big('0.25'), 3);
        coin.count(0);
        assert.strictEqual(coin.canTakeAway(), false, "expected can't take away when zero");
    });
    QUnit.test("Can't add when max.", function (assert) {
        var coin = new CoinCounter.Coin('test', 'test', Big('0.25'), 3);
        coin.count(3);
        assert.strictEqual(coin.canAddMore(), false, "expected can't add when max");
    });
}
