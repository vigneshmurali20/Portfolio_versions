#!/usr/bin/env bash
# Install every skill kept in this repo at user level (~/.claude), so they
# load in any project and any Claude Code session on this machine.
#
#   git clone https://github.com/vigneshwaranm-crypto/auto.git ~/claude-skills
#   bash ~/claude-skills/install.sh
#
# Safe to re-run: it refreshes the copies in ~/.claude. Set SKIP_CLAUDE_SEO=1
# to skip the Claude SEO install (it needs network access to GitHub and PyPI).
# Set WITH_VIDEO_DEPS=1 to also install the video toolkit's Python packages
# (needs uv).
set -euo pipefail

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
claude_dir="$HOME/.claude"
claude_seo_tag="v2.4.1"

mkdir -p "$claude_dir/skills" "$claude_dir/agents"

# Skills replaced by newer ones in this repo; removed so they don't load twice.
for retired in remotion-official; do
  rm -rf "${claude_dir:?}/skills/$retired"
done

echo "→ Installing skills into $claude_dir/skills"
for skill in "$repo_dir"/.claude/skills/*/; do
  name=$(basename "$skill")
  rm -rf "${claude_dir:?}/skills/$name"
  cp -r "$skill" "$claude_dir/skills/$name"
  echo "  • $name"
done

echo "→ Installing agents into $claude_dir/agents"
for agent in "$repo_dir"/.claude/agents/*.md; do
  [ -f "$agent" ] || continue
  cp "$agent" "$claude_dir/agents/"
  echo "  • $(basename "$agent" .md)"
done

echo "→ Installing writing profiles into $claude_dir/writing"
# Templates only fill gaps: profiles the user already created are never
# overwritten.
(cd "$repo_dir/writing" && find . -type f) | while read -r f; do
  dest="$claude_dir/writing/$f"
  [ -e "$dest" ] && continue
  mkdir -p "$(dirname "$dest")" && cp "$repo_dir/writing/$f" "$dest"
done

echo "→ Installing video toolkit into $claude_dir/video-toolkit"
# Overlay the toolkit; .env and projects/ hold the user's own keys and work.
mkdir -p "$claude_dir/video-toolkit"
(cd "$repo_dir/video-toolkit" && tar cf - --exclude=./.env --exclude=./projects .) \
  | tar xf - -C "$claude_dir/video-toolkit"
mkdir -p "$claude_dir/video-toolkit/projects"
if [ "${WITH_VIDEO_DEPS:-0}" = 1 ]; then
  (cd "$claude_dir/video-toolkit" && uv sync --quiet) && echo "  • Python deps synced"
fi

echo "→ Installing HyperFrames plugin"
# Official plugin from the public heygen-com/hyperframes repo (21 skills).
if command -v claude >/dev/null 2>&1; then
  claude plugin marketplace add heygen-com/hyperframes >/dev/null 2>&1 \
    || claude plugin marketplace update hyperframes >/dev/null 2>&1 || true
  if claude plugin install hyperframes@hyperframes >/dev/null 2>&1; then
    echo "  • hyperframes@hyperframes"
  else
    echo "  ✗ HyperFrames plugin install failed; run: claude plugin install hyperframes@hyperframes" >&2
  fi
else
  echo "  ⚠ claude CLI not found; skipped (install with: claude plugin marketplace add heygen-com/hyperframes)"
fi

echo "→ Installing ECC plugin (hooks off)"
# affaan-m/ECC: 293 skills, 68 agents, 94 commands. Its hooks start disabled;
# an existing choice in ~/.claude/settings.json is left as it is.
if command -v claude >/dev/null 2>&1; then
  ecc_config=(--config hooks_enabled=false --config hook_profile=minimal)
  grep -q '"ecc@ecc"' "$claude_dir/settings.json" 2>/dev/null && ecc_config=()
  claude plugin marketplace add affaan-m/ECC >/dev/null 2>&1 \
    || claude plugin marketplace update ecc >/dev/null 2>&1 || true
  if claude plugin install ecc@ecc "${ecc_config[@]}" >/dev/null 2>&1; then
    echo "  • ecc@ecc"
  else
    echo "  ✗ ECC plugin install failed; run: claude plugin install ecc@ecc --config hooks_enabled=false" >&2
  fi
else
  echo "  ⚠ claude CLI not found; skipped"
fi

if [ "${SKIP_CLAUDE_SEO:-0}" != 1 ]; then
  echo "→ Installing Claude SEO $claude_seo_tag"
  tmp=$(mktemp -d)
  trap 'rm -rf -- "$tmp"' EXIT
  git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$claude_seo_tag" \
    https://github.com/AgriciDaniel/claude-seo.git "$tmp/claude-seo"
  # Its installer exits 0 even when the optional Chromium download fails.
  CLAUDE_SEO_TAG="$claude_seo_tag" bash "$tmp/claude-seo/install.sh" >"$tmp/claude-seo.log" 2>&1 \
    || { echo "  ✗ Claude SEO install failed; see log below" >&2; tail -20 "$tmp/claude-seo.log" >&2; exit 1; }
  grep -q "Chromium setup is incomplete" "$tmp/claude-seo.log" \
    && echo "  ⚠ Chromium unavailable: rendered-page and screenshot checks are off"
  echo "  • seo + sub-skills and agents"
fi

echo "✓ Done. Start a new Claude Code session to load them."
