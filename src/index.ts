$(document).ready(function () {
  var vm = new CoinCounterViewModel();
  vm.initialize();
  ko.applyBindings(vm);
});
