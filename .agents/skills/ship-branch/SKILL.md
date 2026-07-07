---
name: ship-branch
description: Use when ready to ship a feature branch — stages uncommitted changes, squashes commits, creates a PR, and monitors CI. Stops after CI passes and waits for explicit instruction to merge.
---

# Ship Branch

Full workflow: commit → squash → push → PR → CI → stop. **Do not merge unless explicitly asked.**

If the user invoked this skill with "merge" (e.g. `/ship-branch merge` or "ship branch and merge"), set `auto_merge=true` and do **not** stop after CI — continue straight through merge and cleanup without asking.

```dot
digraph ship_branch {
    rankdir=TB;
    "Start" [shape=doublecircle];
    "Unstaged changes?" [shape=diamond];
    "Base branch known?" [shape=diamond];
    "Branch pushed?" [shape=diamond];
    "PR exists?" [shape=diamond];
    "CI exists?" [shape=diamond];
    "CI passed?" [shape=diamond];
    "auto_merge?" [shape=diamond];
    "Stage & commit" [shape=box];
    "Ask user for base branch" [shape=box];
    "Squash all since base" [shape=box];
    "Squash unpushed only" [shape=box];
    "Push / force push" [shape=box];
    "Create PR" [shape=box];
    "Loop: poll CI" [shape=box];
    "Fix errors" [shape=box];
    "Merge PR" [shape=box];
    "Cleanup branch" [shape=box];
    "STOP: report CI passed, await merge instruction" [shape=doublecircle];
    "STOP: report PR ready, await merge instruction" [shape=doublecircle];
    "Done" [shape=doublecircle];

    "Start" -> "Unstaged changes?";
    "Unstaged changes?" -> "Stage & commit" [label="yes"];
    "Unstaged changes?" -> "Base branch known?" [label="no"];
    "Stage & commit" -> "Base branch known?";
    "Base branch known?" -> "Ask user for base branch" [label="no"];
    "Ask user for base branch" -> "Branch pushed?";
    "Base branch known?" -> "Branch pushed?" [label="yes"];
    "Branch pushed?" -> "Squash all since base" [label="no"];
    "Branch pushed?" -> "Squash unpushed only" [label="yes"];
    "Squash all since base" -> "Push / force push";
    "Squash unpushed only" -> "Push / force push";
    "Push / force push" -> "PR exists?";
    "PR exists?" -> "CI exists?" [label="yes"];
    "PR exists?" -> "Create PR" [label="no"];
    "Create PR" -> "CI exists?";
    "CI exists?" -> "Loop: poll CI" [label="yes"];
    "CI exists?" -> "auto_merge?" [label="no"];
    "auto_merge?" -> "Merge PR" [label="yes"];
    "auto_merge?" -> "STOP: report PR ready, await merge instruction" [label="no"];
    "Loop: poll CI" -> "CI passed?";
    "CI passed?" -> "Fix errors" [label="no"];
    "Fix errors" -> "Squash unpushed only";
    "CI passed?" -> "auto_merge?" [label="yes"];
    "auto_merge?" -> "Merge PR" [label="yes (CI path)"];
    "auto_merge?" -> "STOP: report CI passed, await merge instruction" [label="no (CI path)"];
    "Merge PR" -> "Cleanup branch";
    "Cleanup branch" -> "Done";
}
```

## Commands

**Stage & commit:**

```bash
git add -A && git commit -m "<message>"
```

**Squash — not yet pushed:**

```bash
git reset --soft "$(git merge-base HEAD <base-branch>)"
git commit -m "<message>"
git push -u origin <branch>
```

**Squash — already pushed:**

```bash
git reset --soft "HEAD~$(git rev-list --count origin/<branch>..HEAD)"
git commit -m "<message>"
git push --force-with-lease
```

**Create PR:**

```bash
gh pr create --base <base-branch> --title "<title>" --body "<body>"
```

**Poll CI — use /loop (dynamic, no interval):**

Invoke the `loop` skill with no interval (dynamic mode). Dynamic mode uses `ScheduleWakeup` and self-terminates naturally — just don't schedule the next wakeup when done. On each wakeup:

1. Run `gh pr checks <PR_NUMBER>`
2. All pass → proceed to `auto_merge?`, do NOT schedule next wakeup
3. Any fail → run `gh run view <run-id> --log-failed`, fix errors, re-squash, do NOT schedule next wakeup
4. Still pending → schedule next wakeup (60s)

**Merge** (standard merge commit format):

```bash
PR_NUMBER=$(gh pr view --json number -q '.number')
REPO_OWNER=$(gh repo view --json owner -q '.owner.login')
BRANCH=$(git rev-parse --abbrev-ref HEAD)
PR_TITLE=$(gh pr view --json title -q '.title')

gh pr merge "$PR_NUMBER" --merge \
  --subject "Merge pull request #${PR_NUMBER} from ${REPO_OWNER}/${BRANCH}" \
  --body "$PR_TITLE"
```

**Cleanup** (always runs after merge):

```bash
git push origin --delete <branch>
git checkout <base-branch> && git pull
git branch -d <branch>
```
