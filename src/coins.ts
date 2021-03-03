module CoinCounter {
  export class Coin {
    public imgSrc: string;
    public count: KnockoutObservable<number>;
    public max: KnockoutObservable<number>;
    public addCoinEnabled?: KnockoutComputed<boolean>;
    public removeCoinEnabled?: KnockoutComputed<boolean>;

    constructor(
      public name: string,
      public style: string,
      public value: BigJsLibrary.BigJS,
      max: number = 10,
    ) {
      this.imgSrc = style + '.png';
      this.count = ko.observable(0);
      this.max = ko.observable(max);
    }
  }

  export var coins = [
    new Coin('Penny', 'penny', Big('0.01')),
    new Coin('Nickel', 'nickel', Big('0.05')),
    new Coin('Dime', 'dime', Big('0.10')),
    new Coin('Quarter', 'quarter', Big('0.25'), 4),
  ];
}
