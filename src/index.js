"use strict";
$(document).ready(function () {
    var vm = new CoinCounter.CoinCounterViewModel();
    vm.initialize();
    ko.applyBindings(vm);
});
