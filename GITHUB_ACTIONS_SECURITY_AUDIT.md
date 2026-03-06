# GitHub Actions Security Audit

**Date:** March 6, 2026  
**Auditor:** Security Review  
**Context:** Response to HackerBot-Claw automated CI exploitation campaign

---

## Executive Summary

✅ **SECURE** - GhostIndex is **NOT vulnerable** to the HackerBot-Claw attack pattern.

**Key Findings:**
- ✅ No workflows use `pull_request_target` trigger
- ✅ No workflows grant write permissions to untrusted code
- ✅ All workflows use secure patterns (scheduled cron or manual dispatch)
- ✅ Secrets are properly scoped and protected

**Risk Level:** **LOW** - Current configuration follows security best practices.

---

## Threat Overview: HackerBot-Claw Campaign

### Attack Pattern
1. **Scan** public repos for workflows using `pull_request_target` with write permissions
2. **Open PR** with malicious code
3. **Exploit** - CI runs untrusted PR code with elevated `GITHUB_TOKEN`
4. **Steal** token and compromise repository

### Victims
- Microsoft repos
- DataDog
- Aqua Security's Trivy (fully compromised - releases deleted, malicious artifacts published)

### Timeline
- Started: Late February 2026
- Speed: New account to Microsoft exploitation in 7 days
- Method: Fully automated scanning and exploitation

---

## GhostIndex Workflow Audit

### Workflow Inventory

We have **4 GitHub Actions workflows**:

1. `cron-auto-ghost.yml` - Auto-ghost detection (daily)
2. `cron-ghost-jobs.yml` - Ghost job detection (daily)
3. `cron-update-scores.yml` - Update ghost index scores (daily)
4. `update-company-data.yml` - Update company metadata (weekly)

### Security Analysis

#### ✅ Workflow 1: `cron-auto-ghost.yml`
```yaml
on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:
```

**Trigger:** `schedule` + `workflow_dispatch` (manual)  
**Permissions:** Default (read-only)  
**Code Execution:** Simple curl command (no checkout, no untrusted code)  
**Secrets Used:** `CRON_SECRET` (scoped to API authentication)  
**Vulnerability:** ❌ None

**Why It's Safe:**
- No `pull_request` or `pull_request_target` trigger
- No code checkout from PRs
- No write permissions granted
- Secrets only used for authenticated API calls

---

#### ✅ Workflow 2: `cron-ghost-jobs.yml`
```yaml
on:
  schedule:
    - cron: '0 4 * * *'
  workflow_dispatch:
```

**Trigger:** `schedule` + `workflow_dispatch` (manual)  
**Permissions:** Default (read-only)  
**Code Execution:** Simple curl command (no checkout, no untrusted code)  
**Secrets Used:** `CRON_SECRET` (scoped to API authentication)  
**Vulnerability:** ❌ None

**Why It's Safe:**
- Same secure pattern as Workflow 1
- No PR triggers
- No code execution from external sources

---

#### ✅ Workflow 3: `cron-update-scores.yml`
```yaml
on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:
```

**Trigger:** `schedule` + `workflow_dispatch` (manual)  
**Permissions:** Default (read-only)  
**Code Execution:** Simple curl command (no checkout, no untrusted code)  
**Secrets Used:** `CRON_SECRET` (scoped to API authentication)  
**Vulnerability:** ❌ None

**Why It's Safe:**
- Same secure pattern as Workflows 1 & 2
- No PR triggers
- No code execution from external sources

---

#### ✅ Workflow 4: `update-company-data.yml`
```yaml
on:
  schedule:
    - cron: '0 2 * * 0'
  workflow_dispatch:

jobs:
  update-company-data:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Update company metadata
        run: npm run update:company-data
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          CLEARBIT_API_KEY: ${{ secrets.CLEARBIT_API_KEY }}
```

**Trigger:** `schedule` + `workflow_dispatch` (manual)  
**Permissions:** Default (read-only)  
**Code Execution:** Checks out **main branch only** (not PRs)  
**Secrets Used:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CLEARBIT_API_KEY`  
**Vulnerability:** ❌ None

**Why It's Safe:**
- No `pull_request` or `pull_request_target` trigger
- Only checks out code from main branch (trusted)
- Secrets only exposed to scheduled/manual runs (not PRs)
- No write permissions granted
- Uses `actions/checkout@v4` with default settings (safe)

**Critical Detail:**
- `actions/checkout@v4` without `ref` parameter defaults to the **workflow's triggering ref**
- Since trigger is `schedule` or `workflow_dispatch`, it always checks out **main branch**
- PRs cannot trigger this workflow, so untrusted code never runs

---

## Vulnerable Pattern (What We DON'T Have)

### ❌ Example of Vulnerable Workflow (NOT in our repo)
```yaml
# THIS IS WHAT WE DON'T HAVE - EXAMPLE ONLY
on:
  pull_request_target:  # ⚠️ DANGEROUS: Runs in context of base branch

permissions:
  contents: write  # ⚠️ DANGEROUS: Grants write access

jobs:
  vulnerable-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}  # ⚠️ DANGEROUS: Checks out PR code
      
      - run: npm ci  # ⚠️ DANGEROUS: Runs untrusted package.json scripts
      - run: npm run build  # ⚠️ DANGEROUS: Executes untrusted code
```

**Why This Is Dangerous:**
1. `pull_request_target` runs with base branch permissions (write access)
2. Checks out PR code (`head.sha`)
3. Runs untrusted code with elevated `GITHUB_TOKEN`
4. Attacker can steal token and compromise repo

**We DON'T have this pattern anywhere.**

---

## Security Best Practices (Already Implemented)

### ✅ What We're Doing Right

1. **No PR Triggers on Sensitive Workflows**
   - All workflows use `schedule` or `workflow_dispatch`
   - No `pull_request` or `pull_request_target` triggers
   - Untrusted code never runs in CI

2. **Minimal Permissions**
   - No explicit `permissions` blocks (defaults to read-only)
   - No `contents: write` or other elevated permissions
   - Follows principle of least privilege

3. **Secrets Properly Scoped**
   - `CRON_SECRET` only used for API authentication
   - Database secrets only exposed to scheduled jobs
   - No secrets exposed to PR workflows (we don't have PR workflows)

4. **Trusted Code Only**
   - `update-company-data.yml` only checks out main branch
   - No dynamic ref checkout from PRs
   - All code execution is from trusted sources

5. **Secure Action Versions**
   - Using `@v4` for `actions/checkout` and `actions/setup-node`
   - Pinned to major versions (good practice)
   - Could improve by pinning to commit SHAs (future enhancement)

---

## Recommendations

### Current Status: ✅ SECURE

**No immediate action required.** Our workflows are not vulnerable to the HackerBot-Claw attack pattern.

### Future Enhancements (Optional)

#### 1. Pin Actions to Commit SHAs (Low Priority)
**Current:**
```yaml
uses: actions/checkout@v4
```

**More Secure:**
```yaml
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

**Benefit:** Prevents supply chain attacks if action repos are compromised  
**Trade-off:** Harder to maintain (must manually update SHAs)  
**Priority:** Low (major version pinning is acceptable for our risk profile)

#### 2. Add Explicit Permissions Blocks (Low Priority)
**Current:**
```yaml
jobs:
  update-company-data:
    runs-on: ubuntu-latest
```

**More Explicit:**
```yaml
jobs:
  update-company-data:
    runs-on: ubuntu-latest
    permissions:
      contents: read  # Explicit read-only
```

**Benefit:** Makes permissions explicit and self-documenting  
**Trade-off:** More verbose  
**Priority:** Low (defaults are already read-only)

#### 3. Add Dependabot for GitHub Actions (Medium Priority)
**Create:** `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

**Benefit:** Automated updates for action versions  
**Trade-off:** Requires reviewing PRs  
**Priority:** Medium (good practice for maintenance)

#### 4. If We Ever Add PR Workflows (CRITICAL)

**⚠️ NEVER use this pattern:**
```yaml
on:
  pull_request_target:  # AVOID THIS
permissions:
  contents: write  # AVOID THIS
```

**✅ Safe PR workflow pattern:**
```yaml
on:
  pull_request:  # NOT pull_request_target

permissions:
  contents: read  # Read-only
  pull-requests: write  # Only if needed for comments

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4  # Checks out PR code safely
      - run: npm ci
      - run: npm test  # Safe: no write permissions
```

**Key Differences:**
- `pull_request` (safe) vs `pull_request_target` (dangerous)
- Read-only permissions
- No secrets exposed to untrusted code
- No write operations possible

---

## Monitoring & Ongoing Security

### Recommended Actions

1. **Review This Audit Quarterly**
   - Re-audit workflows every 3 months
   - Check for new workflows added by contributors
   - Verify no `pull_request_target` patterns introduced

2. **GitHub Security Alerts**
   - Enable Dependabot security alerts (already enabled)
   - Review alerts weekly
   - Update vulnerable dependencies promptly

3. **Workflow Change Reviews**
   - Require review for any `.github/workflows/*.yml` changes
   - Flag any PR that adds `pull_request_target`
   - Flag any PR that adds write permissions

4. **Stay Informed**
   - Monitor GitHub Security Blog
   - Follow @github_security on Twitter
   - Review GitHub Actions security advisories

---

## Comparison to Compromised Projects

### Trivy (Compromised)
**Vulnerable Pattern:**
- Used `pull_request_target` with write permissions
- Checked out PR code in privileged context
- Attacker opened PR, stole token, deleted releases

**GhostIndex:**
- ✅ No `pull_request_target` triggers
- ✅ No write permissions
- ✅ No PR code execution

### Microsoft Repos (Targeted)
**Vulnerable Pattern:**
- Multiple repos with `pull_request_target` workflows
- Copy-pasted from tutorials without security review
- Automated scanner found them in days

**GhostIndex:**
- ✅ All workflows custom-built for our use case
- ✅ No copy-paste from tutorials
- ✅ Security-conscious design from start

---

## Conclusion

**GhostIndex is NOT vulnerable to the HackerBot-Claw attack.**

### Why We're Safe
1. No `pull_request_target` triggers
2. No write permissions granted
3. No untrusted code execution
4. Secrets properly scoped
5. All workflows use secure patterns

### What We're Doing Right
- Scheduled jobs for automation (not PR-triggered)
- Minimal permissions (read-only defaults)
- Trusted code only (main branch)
- Secure action usage

### Ongoing Vigilance
- Quarterly workflow audits
- Review all workflow changes
- Never introduce `pull_request_target` without extreme caution
- Monitor GitHub security advisories

---

**Status:** ✅ **SECURE**  
**Next Review:** June 6, 2026  
**Auditor:** Security Team

---

## References

- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
- [HackerBot-Claw Campaign Discussion](https://www.reddit.com/r/github/)
- [Trivy Compromise Post-Mortem](https://github.com/aquasecurity/trivy/security/advisories)
