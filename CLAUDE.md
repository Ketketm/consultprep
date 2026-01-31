# Project Instructions

## Core Workflow: ALWAYS Follow This Pattern

### Phase 1: EXPLORE (Research First)
- NEVER jump straight to coding
- Read relevant files before proposing changes
- Understand existing patterns, architecture, conventions
- Use Task tool with Explore agent for codebase discovery

### Phase 2: PLAN (Think Before Acting)
- Use "think hard" or "ultrathink" for complex problems
- Create explicit plan before implementation
- Identify risks, edge cases, dependencies
- Get user approval on approach for significant changes

### Phase 3: EXECUTE (Implement with Precision)
- Follow existing code patterns and conventions
- Make minimal, focused changes
- Avoid over-engineering - solve only what's asked
- Write tests alongside implementation when appropriate

### Phase 4: VALIDATE (Self-Critique as Arbiter)
- IMPORTANT: After completing code, critically review your own work
- Ask yourself: "What could break? What edge cases exist?"
- Run tests/linters before declaring done
- Challenge your assumptions - be your own harshest critic

### Phase 5: COMMIT (Clean Closure)
- Commit with context-aware messages
- Update relevant documentation if needed

---

## Quality Gates (Arbiter Mindset)

BEFORE marking any task complete, YOU MUST verify:

1. **Correctness**: Does it actually solve the problem?
2. **Edge Cases**: What inputs could break this?
3. **Security**: Any injection, XSS, auth issues?
4. **Performance**: Any obvious bottlenecks?
5. **Maintainability**: Will future developers understand this?

If ANY gate fails, fix it before proceeding.

---

## Extended Thinking Triggers

Use these when complexity demands deeper analysis:
- "think" → standard extended thinking
- "think hard" → deeper multi-step analysis
- "think harder" → thorough exploration of alternatives
- "ultrathink" → maximum reasoning for critical decisions

---

## Multi-Agent Patterns

When working on complex tasks:
- Use Task tool to spawn specialized subagents
- Parallelize independent explorations
- Use one agent to verify another's work when possible
- Maintain clear separation of concerns

---

## Code Style

- Match existing project conventions exactly
- Prefer simple, readable code over clever code
- No unnecessary abstractions or premature optimization
- Only add comments where logic isn't self-evident

---

## Self-Correction Protocol

If you make a mistake:
1. Acknowledge it directly
2. Explain what went wrong
3. Fix it properly (don't patch over)
4. Learn: add pattern to avoid in future

---

## Automatic Review Loop

A review hook runs automatically after each code edit. The system:

1. **Reviews** → Checks security, syntax, complexity
2. **Scores** → 0-100 quality score
3. **Verdicts**:
   - `approved` (score >= 80) → Proceed
   - `approved_with_warnings` (60-79) → Proceed but note issues
   - `needs_revision` (50-59) → Fix before continuing
   - `rejected` (< 50) → MUST fix critical issues

### When Review Fails

If you see review feedback with issues:
1. Read the specific issues listed
2. Fix them in priority order: SECURITY > SYNTAX > QUALITY
3. The code will be re-reviewed automatically after edits
4. Loop until approved

### Pre-Commit Gate

Before any `git commit`, the arbiter checks all recent reviews:
- If ANY file is rejected → commit blocked
- If average score < 60 → commit blocked
- Fix issues, then retry commit

### Manual Review Commands

```bash
# Check current review status
~/.claude/hooks/arbiter-gate.sh status

# Get revision feedback
~/.claude/hooks/revision-feedback.sh prompt

# Force deep review
REVIEW_LEVEL=deep ~/.claude/hooks/review-loop.sh <file>
```

---

## Challenge Mode

When asked to review or improve code:
- Be constructively critical, not complimentary
- Find real issues, not superficial ones
- Suggest concrete improvements with reasoning
- Don't accept "it works" as sufficient quality bar
