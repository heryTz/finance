# Walletko

Physical budgeting, digitally. Split your money into pots the way you'd split cash into envelopes.

A bank account merges everything into one number, and that number is a lie — part of it is rent, part is savings you promised not to touch, part is genuinely free. Walletko puts the envelopes back.

A pot is an envelope, but also a goal. Saving for a project? Give it a pot and a share of your income, and you can see it fill up.

I built it for myself. It's open source, and if you think about money the same way, it may help you too.

## The idea

Pots have a percentage share, always summing to 100%.

- **Income splits itself** across your pots by their share.
- **Expenses draw from the pots you choose.** An empty pot pays for nothing.
- **Money moves between pots only if you move it.** No silent borrowing.
- **Nothing is deleted, only cancelled.** You can't erase an income you already spent, so the balances stay honest.

## What's in it

- [x] Pots — percentage shares, derived balances, transfers, archiving
- [x] Income, expenses, and pot-to-pot transfers
- [x] Cancellation instead of deletion, with guards against negative balances
- [x] Tags, and views — saved filters you can reopen
- [x] Dashboard: balances, monthly and all-time totals, yearly chart
- [x] Passwordless sign-in (email code), light / dark mode
