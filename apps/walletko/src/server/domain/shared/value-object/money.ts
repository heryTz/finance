// Stripe money system like

import type { Percentage } from "./percentage";

// Cents system allow us to have deterministic amount, without floating issue
export class Money {
  private cents: number;

  constructor(amount: number) {
    if (amount < 0) throw new Error("Money amount cannot be negative");
    this.cents = Math.floor(amount * 100);
  }

  get value() {
    return this.cents / 100;
  }

  get rawCents() {
    return this.cents;
  }

  add(other: Money) {
    return Money.fromCents(this.cents + other.rawCents);
  }

  isLessThan(other: Money) {
    return this.cents < other.rawCents;
  }

  isLessOrEqualThan(other: Money) {
    return this.cents <= other.rawCents;
  }

  substract(other: Money) {
    if (this.isLessThan(other)) throw new Error("Insufficient balance");
    return Money.fromCents(this.cents - other.rawCents);
  }

  percentOf(percentage: Percentage) {
    return Money.fromCents(this.cents * percentage.rate);
  }

  static fromCents(cents: number) {
    return new Money(cents / 100);
  }
}
