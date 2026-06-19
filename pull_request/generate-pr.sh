#!/usr/bin/env bash
# generate-pr.sh
# Auto-generate Pull Request description/review from git changes.
#
# Usage:
#   ./generate-pr.sh [type] [branch] [pr_number]
#     type      : basic | lead | hod          (default: basic)
#     branch    : target branch               (default: current branch)
#     pr_number : PR number for the URL        (default: TBD)
#
# Output:
#   ~/Developer/office/ivosights/pull_request/<app_name>/pull_request_<datetime>.md

set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
die() { echo "❌ Error: $*" >&2; exit 1; }

# Ensure we are inside a git repository
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not inside a git repository."

# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------
TYPE="${1:-basic}"
BRANCH="${2:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "HEAD")}"
PR_NUMBER="${3:-TBD}"

case "$TYPE" in
    basic) TEMPLATE_NAME="basic" ;;
    lead)  TEMPLATE_NAME="lead-review" ;;
    hod)   TEMPLATE_NAME="hod-review" ;;
    *)     die "Invalid type '$TYPE'. Use: basic | lead | hod" ;;
esac

# ---------------------------------------------------------------------------
# Repo & meta info
# ---------------------------------------------------------------------------
REPO="$(basename "$(git rev-parse --show-toplevel)")"
APP_NAME="${REPO//-/_}"
DATETIME="$(date +"%Y%m%d_%H%M%S")"
DATE="$(date +"%Y-%m-%d")"
AUTHOR="$(git config user.name 2>/dev/null || echo "Unknown")"

# ---------------------------------------------------------------------------
# Determine base branch (master or main)
# ---------------------------------------------------------------------------
BASE_BRANCH=""
for candidate in origin/master origin/main master main; do
    if git rev-parse --verify "$candidate" >/dev/null 2>&1; then
        BASE_BRANCH="$candidate"
        break
    fi
done
[[ -n "$BASE_BRANCH" ]] || die "Could not resolve base branch (master/main)."

# ---------------------------------------------------------------------------
# Resolve the comparison target (the "head" side of the diff)
#   Priority: origin/<branch>  ->  <branch>  ->  working tree (uncommitted)
# ---------------------------------------------------------------------------
COMPARE_MODE=""
HEAD_REF=""

if git rev-parse --verify "origin/$BRANCH" >/dev/null 2>&1 \
   && [[ -n "$(git diff "$BASE_BRANCH".."origin/$BRANCH" --name-only 2>/dev/null)" ]]; then
    HEAD_REF="origin/$BRANCH"
    COMPARE_MODE="branch"
elif git rev-parse --verify "$BRANCH" >/dev/null 2>&1 \
   && [[ -n "$(git diff "$BASE_BRANCH".."$BRANCH" --name-only 2>/dev/null)" ]]; then
    HEAD_REF="$BRANCH"
    COMPARE_MODE="branch"
elif [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    # Fall back to uncommitted working tree changes
    COMPARE_MODE="working"
else
    die "No changes found for branch '$BRANCH' vs '$BASE_BRANCH' and no uncommitted changes."
fi

# ---------------------------------------------------------------------------
# Gather diff data based on compare mode
# ---------------------------------------------------------------------------
if [[ "$COMPARE_MODE" == "branch" ]]; then
    DIFF_RANGE="$BASE_BRANCH..$HEAD_REF"
    DIFF_STAT="$(git diff "$DIFF_RANGE" --stat)"
    NAME_ONLY="$(git diff "$DIFF_RANGE" --name-only)"
    NEW_NAMES="$(git diff "$DIFF_RANGE" --name-only --diff-filter=A)"
    NUMSTAT="$(git diff "$DIFF_RANGE" --numstat)"
    COMMITS="$(git log "$DIFF_RANGE" --oneline)"
else
    # working tree (staged + unstaged) vs HEAD
    DIFF_STAT="$(git diff HEAD --stat)"
    NAME_ONLY="$(git diff HEAD --name-only)"
    NEW_NAMES="$(git ls-files --others --exclude-standard)"
    NUMSTAT="$(git diff HEAD --numstat)"
    COMMITS="(uncommitted working-tree changes)"
fi

# ---------------------------------------------------------------------------
# Counts
# ---------------------------------------------------------------------------
count_lines() { [[ -z "$1" ]] && echo 0 || echo "$1" | grep -c . ; }

FILES_COUNT="$(count_lines "$NAME_ONLY")"
BACKEND_COUNT="$(echo "$NAME_ONLY" | grep -cE '\.php$' || true)"
FRONTEND_COUNT="$(echo "$NAME_ONLY" | grep -cE '\.(js|ts)$' || true)"
BLADE_COUNT="$(echo "$NAME_ONLY" | grep -cE '\.blade\.php$' || true)"
NEW_FILES="$(count_lines "$NEW_NAMES")"
COMMITS_COUNT="$(count_lines "$COMMITS")"

LINES_ADDED="$(echo "$NUMSTAT" | awk '{sum+=$1} END {print sum+0}')"
LINES_REMOVED="$(echo "$NUMSTAT" | awk '{sum+=$2} END {print sum+0}')"

SUMMARY="Pull request from branch \`$BRANCH\` ($COMPARE_MODE mode) with $FILES_COUNT file(s) changed, +$LINES_ADDED/-$LINES_REMOVED lines."

# Build a markdown table of modified files
if [[ -n "$NAME_ONLY" ]]; then
    FILES_MODIFIED="$(echo "$NAME_ONLY" | sed 's/.*/| `&` |/')"
    FILES_MODIFIED="| File |"$'\n'"|------|"$'\n'"$FILES_MODIFIED"
else
    FILES_MODIFIED="_No files_"
fi

# ---------------------------------------------------------------------------
# Template resolution
# ---------------------------------------------------------------------------
TEMPLATE_DIR="$HOME/Developer/agent_opencode/pull_request/templates"
TEMPLATE_FILE="$TEMPLATE_DIR/$TEMPLATE_NAME.md"
[[ -f "$TEMPLATE_FILE" ]] || die "Template not found: $TEMPLATE_FILE"

# ---------------------------------------------------------------------------
# Output path (avoid collisions)
# ---------------------------------------------------------------------------
OUTPUT_DIR="$HOME/Developer/agent_opencode/pull_request/output/$APP_NAME"
mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/pull_request_${DATETIME}.md"
counter=1
while [[ -e "$OUTPUT_FILE" ]]; do
    OUTPUT_FILE="$OUTPUT_DIR/pull_request_${DATETIME}_${counter}.md"
    counter=$((counter + 1))
done

# ---------------------------------------------------------------------------
# Render template (multiline-safe via awk placeholder replacement)
# ---------------------------------------------------------------------------
render() {
    local content
    content="$(cat "$TEMPLATE_FILE")"

    # Single-line replacements use awk gsub with literal strings.
    # Multiline values are injected via environment + awk to stay safe.
    REPO="$REPO" BRANCH="$BRANCH" PR_NUMBER="$PR_NUMBER" AUTHOR="$AUTHOR" \
    DATE="$DATE" DATETIME="$DATETIME" SUMMARY="$SUMMARY" \
    FILES_COUNT="$FILES_COUNT" BACKEND_COUNT="$BACKEND_COUNT" \
    FRONTEND_COUNT="$FRONTEND_COUNT" BLADE_COUNT="$BLADE_COUNT" \
    NEW_FILES="$NEW_FILES" LINES_ADDED="$LINES_ADDED" \
    LINES_REMOVED="$LINES_REMOVED" COMMITS_COUNT="$COMMITS_COUNT" \
    DIFF_STAT="$DIFF_STAT" COMMITS="$COMMITS" FILES_MODIFIED="$FILES_MODIFIED" \
    awk '
    BEGIN {
        # Map placeholder -> env var name
        n = split("REPO BRANCH PR_NUMBER AUTHOR DATE DATETIME SUMMARY FILES_COUNT BACKEND_COUNT FRONTEND_COUNT BLADE_COUNT NEW_FILES LINES_ADDED LINES_REMOVED COMMITS_COUNT DIFF_STAT COMMITS FILES_MODIFIED", keys, " ")
    }
    {
        line = $0
        for (i = 1; i <= n; i++) {
            ph = "{{" keys[i] "}}"
            val = ENVIRON[keys[i]]
            # replace all occurrences without regex interpretation
            while ((idx = index(line, ph)) > 0) {
                line = substr(line, 1, idx-1) val substr(line, idx + length(ph))
            }
        }
        print line
    }' <<< "$content"
}

render > "$OUTPUT_FILE"

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
echo "✅ Pull Request generated successfully!"
echo "📁 Output : $OUTPUT_FILE"
echo "📋 Type   : $TYPE ($TEMPLATE_NAME)"
echo "🌿 Branch : $BRANCH  [base: $BASE_BRANCH, mode: $COMPARE_MODE]"
echo "📊 Files  : $FILES_COUNT (PHP: $BACKEND_COUNT, JS/TS: $FRONTEND_COUNT, Blade: $BLADE_COUNT, New: $NEW_FILES)"
echo "➕ Lines  : +$LINES_ADDED / -$LINES_REMOVED"
echo "🔢 Commits: $COMMITS_COUNT"
