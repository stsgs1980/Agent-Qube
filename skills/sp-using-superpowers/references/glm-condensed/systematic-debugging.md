# Systematic Debugging (GLM Condensed)

## Process

1. **Understand**: Reproduce the bug. Confirm what should happen vs. what happens.
2. **Hypothesize**: Form a specific hypothesis about root cause. Not "something is wrong" but "X causes Y because Z".
3. **Test hypothesis**: Write a test that proves/disproves it. Or add logging.
4. **Fix**: Make the minimal change that addresses root cause.
5. **Verify**: Run the failing test. Run full suite. Confirm no regression.

## Rules

- Reproduce FIRST, before investigating
- One hypothesis at a time
- Fix root cause, not symptoms
- Add a regression test for every fix
- If you can't form a hypothesis, add more observability (logging, tracing)
- If stuck > 15 min, step back and reconsider hypotheses

## Escalation

If you've exhausted 3+ hypotheses without progress, stop. Report what you tried and what you learned. Ask for help or a different approach.