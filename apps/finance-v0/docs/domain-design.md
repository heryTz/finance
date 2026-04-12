# Domain Design

## Overview

Money received is dispatched into pots based on each pot's allocation percentage. All pot percentages must sum to 100. Pots track a balance. Expenses are drawn from one or more pots. Only income and expenses are tracked — internal transfers between income and pots are not explicit transactions.

---

## Entities

### Pot

| Field                | Type    | Notes                          |
|----------------------|---------|--------------------------------|
| `id`                 | uuid    |                                |
| `name`               | string  |                                |
| `allocationPercentage` | integer | 1–100                        |
| `balance`            | decimal | Derived or maintained          |
| `isDefault`          | boolean | One general pot always exists  |
| `archivedAt`         | date?   | Null if active                 |

**Rules:**
- Sum of all active pot `allocationPercentage` must equal 100 at all times.
- One default (general) pot always exists and cannot be archived.

**Derived balance:**
```
balance = Σ PotAllocation.amount − Σ ExpenseAllocation.amount
```

---

### Income

| Field  | Type    | Notes |
|--------|---------|-------|
| `id`   | uuid    |       |
| `amount` | decimal |     |
| `date` | date    |       |
| `note` | string? |       |

**On creation:** produces one `PotAllocation` per active pot, proportional to each pot's `allocationPercentage`. Rounding remainder goes to the default pot.

---

### PotAllocation

| Field      | Type    | Notes                        |
|------------|---------|------------------------------|
| `id`       | uuid    |                              |
| `incomeId` | uuid    | Reference to Income          |
| `potId`    | uuid    | Reference to Pot             |
| `amount`   | decimal |                              |

**Rule:** Σ `PotAllocation.amount` for a given income = `Income.amount`

---

### Expense

| Field    | Type    | Notes |
|----------|---------|-------|
| `id`     | uuid    |       |
| `amount` | decimal |       |
| `date`   | date    |       |
| `note`   | string? |       |

**On creation:** produces one or more `ExpenseAllocation` records. When a single pot has insufficient balance, the expense can be split across multiple pots.

---

### ExpenseAllocation

| Field       | Type    | Notes                        |
|-------------|---------|------------------------------|
| `id`        | uuid    |                              |
| `expenseId` | uuid    | Reference to Expense         |
| `potId`     | uuid    | Reference to Pot             |
| `amount`    | decimal |                              |

**Rule:** Σ `ExpenseAllocation.amount` for a given expense = `Expense.amount`

---

## Symmetry

Income and expense allocations are symmetric:

| Direction       | Entity              | Rule                          |
|-----------------|---------------------|-------------------------------|
| Income → Pots   | `PotAllocation`     | Distributes income to all pots |
| Expense ← Pots  | `ExpenseAllocation` | Draws expense from one or more pots |

---

## Aggregates

| Aggregate | Root | Children | Owned Invariant |
|-----------|------|----------|-----------------|
| `PotCollection` | `PotCollection` | `Pot[]` | All pot percentages sum to 100 |
| `Income` | `Income` | `PotAllocation[]` | Σ allocations = income amount |
| `Expense` | `Expense` | `ExpenseAllocation[]` | Σ allocations = expense amount |

### PotCollection

Wraps all pots into a single aggregate root that enforces the percentage invariant. All pot mutations go through `PotCollection` — it is impossible to add, update, or archive a pot without the invariant being checked.

**Operations:**
- `addPot(name, percentage)` — validates sum stays 100
- `updatePercentage(potId, newPercentage)` — validates sum stays 100
- `archivePot(potId, redistributedPercentages)` — validates sum stays 100 after redistribution, blocks if pot has remaining balance

### Income

Owns its `PotAllocation` children. `PotAllocation` has no identity outside of its income and is never accessed standalone.

### Expense

Owns its `ExpenseAllocation` children. `ExpenseAllocation` has no identity outside of its expense and is never accessed standalone.

---

## Orchestration

The application service owns dispatch logic — domain aggregates do not reference each other directly.

**On income creation:**
1. Load all active pots
2. Create `Income`
3. Compute allocation amounts per pot (handle rounding → default pot)
4. Create one `PotAllocation` per pot
5. Update each pot's balance
6. Save in one transaction

**On expense creation:**
1. User selects one or more pots to draw from
2. Create `Expense`
3. Create one `ExpenseAllocation` per selected pot
4. Decrease each referenced pot's balance
5. Save in one transaction

---

## Pot Deletion

### Invariant on deletion
Removing a pot breaks the percentage invariant — remaining pots no longer sum to 100. The user must redistribute the deleted pot's percentage before archival.

### If the pot has remaining balance
Deletion is blocked. The user must drain the pot first by recording a real expense before archiving.

### Archival (soft delete)
Pots are never hard deleted. They are archived (`archivedAt` set).

- Archived pots no longer receive income allocations
- Historical `PotAllocation` and `ExpenseAllocation` records remain intact
- Balance derivation stays correct
- The default pot cannot be archived
