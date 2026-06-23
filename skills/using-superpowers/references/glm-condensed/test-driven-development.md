# Test-Driven Development (GLM Condensed)

Every code change follows: RED -> GREEN -> REFACTOR.

## Cycle

1. **RED**: Write a failing test that describes the desired behavior. Run it - it MUST fail.
2. **GREEN**: Write the minimum code to make the test pass. No extra features.
3. **REFACTOR**: Improve code quality while keeping tests green. Clean up.

## Rules

- Write tests BEFORE implementation code
- Each test covers ONE behavior
- Use descriptive test names: "should [expected behavior] when [condition]"
- Run tests after each step
- If test is hard to write, the design needs improvement
- Never skip the RED step
- Never write "just a little extra" during GREEN

## Anti-Patterns (DO NOT DO)

- Writing tests after code is "done"
- Testing implementation details instead of behavior
- Skipping RED step ("I know it'll fail")
- Writing multiple failing tests at once
- Ignoring failing tests