#!/usr/bin/env bash
# developer-kit.sh
# Generate a new use-case folder (usecase-NNN) with requirements.md, tasks.md, tdd.md
#
# Usage:
#   ./developer-kit.sh <docs_dir> "<brief_description>" [usecase_number]
#
#   docs_dir         : target docs directory (e.g. docs/)
#                     if doesn't exist, will be created
#                     if it exists, will create usecase-NNN
#   brief_description: descriptive title/description of the use case
#   usecase_number   : optional explicit 3-digit number (default: auto-increment)

set -euo pipefail

die() { echo "❌ Error: $*" >&2; exit 1; }

DOCS_DIR="${1:-}"
BRIEF="${2:-}"
EXPLICIT_NUM="${3:-}"

[[ -n "$DOCS_DIR" ]]   || die "Missing docs directory. Usage: $0 <docs_dir> \"<brief>\" [usecase_number]"
[[ -n "$BRIEF" ]]      || die "Missing brief description. Usage: $0 <docs_dir> \"<brief>\" [usecase_number]"

# Resolve to absolute path
DOCS_DIR="$(cd "$DOCS_DIR" 2>/dev/null && pwd || echo "$DOCS_DIR")"

# If docs dir doesn't exist → create it as the first usecase
if [[ ! -d "$DOCS_DIR" ]]; then
    echo "📁 Docs directory doesn't exist — creating: $DOCS_DIR"
    mkdir -p "$DOCS_DIR"
    NEXT_NUM="001"
else
    # Auto-increment counter based on existing usecase-NNN folders
    if [[ -n "$EXPLICIT_NUM" ]]; then
        NEXT_NUM="$(printf '%03d' "$((10#$EXPLICIT_NUM))")"
    else
        LAST=0
        while IFS= read -r d; do
            n="$(basename "$d" | sed -nE 's/^usecase-([0-9]+)$/\1/p')"
            [[ -z "$n" ]] && continue
            v="$((10#$n))"
            (( v > LAST )) && LAST="$v"
        done < <(find "$DOCS_DIR" -maxdepth 1 -type d -name 'usecase-[0-9]*' 2>/dev/null)
        NEXT_NUM="$(printf '%03d' "$((LAST + 1))")"
    fi
fi

USECASE_DIR="$DOCS_DIR/usecase-$NEXT_NUM"

# Refuse to overwrite
if [[ -d "$USECASE_DIR" ]]; then
    die "Folder already exists: $USECASE_DIR"
fi

mkdir -p "$USECASE_DIR"

# Meta
DATETIME="$(date +"%Y%m%d_%H%M%S")"
DATE="$(date +"%Y-%m-%d")"
AUTHOR="${AUTHOR:-$(git config user.name 2>/dev/null || echo "Unknown")}"
USECASE_NUMBER="$NEXT_NUM"
USECASE_TITLE="Use Case $NEXT_NUM"

# Create a slug from the brief for nicer title
BRIEF_SLUG="$(echo "$BRIEF" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-60)"

# Templates location
TEMPLATE_DIR="$HOME/Developer/agent_opencode/developer-kit/templates"

# Render a template: replace {{KEY}} with env var of same name
render() {
    local file="$1"
    REPO_TITLE="Use Case $NEXT_NUM" \
    USECASE_TITLE="$USECASE_TITLE" \
    USECASE_NUMBER="$USECASE_NUMBER" \
    DATE="$DATE" \
    DATETIME="$DATETIME" \
    AUTHOR="$AUTHOR" \
    BRIEF_DESCRIPTION="$BRIEF" \
    BRIEF_SLUG="$BRIEF_SLUG" \
    awk '
    BEGIN {
        n = split("USECASE_TITLE USECASE_NUMBER DATE DATETIME AUTHOR BRIEF_DESCRIPTION BRIEF_SLUG", keys, " ")
    }
    {
        line = $0
        for (i = 1; i <= n; i++) {
            ph = "{{" keys[i] "}}"
            val = ENVIRON[keys[i]]
            while ((idx = index(line, ph)) > 0) {
                line = substr(line, 1, idx-1) val substr(line, idx + length(ph))
            }
        }
        print line
    }' "$file"
}

# Generate the 3 files
render "$TEMPLATE_DIR/requirements.md" > "$USECASE_DIR/requirements.md"
render "$TEMPLATE_DIR/tasks.md"       > "$USECASE_DIR/tasks.md"
render "$TEMPLATE_DIR/tdd.md"         > "$USECASE_DIR/tdd.md"

echo "✅ Use case created!"
echo "📁 Folder : $USECASE_DIR"
echo "🔢 Number : usecase-$NEXT_NUM"
echo "📄 Files  : requirements.md · tasks.md · tdd.md"
echo "📝 Brief  : $BRIEF"
