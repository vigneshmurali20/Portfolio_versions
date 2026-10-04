# My Claude Code skills

Every skill I use, kept in one place so it can be installed into any project
or session.

| Skill set | What it does | Source |
| --- | --- | --- |
| Claude SEO (`/seo`, 33 skills, 19 agents) | Site audits, technical SEO, schema, GEO/AI search, local, e-commerce | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.4.1, installed by `install.sh` |
| img2threejs | Rebuild an object in a reference image as a procedural Three.js model | [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) v2.0.0, in `.claude/skills/img2threejs` |
| Impeccable (`/impeccable`, 4 agents) | Frontend design: audit, critique, polish, redesign | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v4.5.0, in `.claude/skills/impeccable` |
| Video toolkit (`video-toolkit` + 12 skills) | Make videos: AI voiceover, images, music, talking heads, Remotion rendering | [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit), in `video-toolkit/`, installed to `~/.claude/video-toolkit` |
| HyperFrames (`/hyperframes:hyperframes`, 21 skills) | Make videos from HTML: compositions, GSAP animation, captions, voiceover, audio-reactive visuals, website capture, rendering via `npx hyperframes` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) official plugin, installed by `install.sh` (needs the `claude` CLI) |
| Remotion (12 official skills) | `remotion-best-practices` router plus create, markup, render, studio, captions, maps, multimedia, interactivity, SaaS, docs, upgrade | [remotion-dev/remotion](https://github.com/remotion-dev/remotion/tree/main/packages/skills) v4.0.532 `packages/skills`, in `.claude/skills/remotion-*` (replaces the toolkit's older `remotion-official` copy) |
| brag (`/brag`, `/brag-slim`) | Turn the project you just shipped into a short launch video, read straight from its code (uses HyperFrames) | [latent-spaces/brag](https://github.com/latent-spaces/brag) v0.4.0 official plugin, installed by `install.sh` (needs the `claude` CLI) |
| unlazy (`/unlazy`) | Completion discipline for long tasks: writes acceptance gates first, splits work with a "Depth Tree", runs approved checks, re-verifies before saying done | [Leonxlnx/unlazy](https://github.com/Leonxlnx/unlazy), in `.claude/skills/unlazy` (optional Stop hook not installed) |
| NotebookLM / Gemini Notebook (MCP server `notebooklm`) | Create notebooks, add sources, run deep research, and generate audio overviews, quizzes, mind maps and reports from Claude | [notebooklm-mcp-server](https://github.com/moodRobotics/notebooklm-mcp-server) v4.0.2 (community, unofficial), opt-in: `WITH_NOTEBOOKLM_MCP=1 bash install.sh` on **your own computer only**, then `notebooklm-mcp-server auth`. Fails on Google accounts with device-bound sessions (DBSC); use the notebooklm skill instead |
| notebooklm skill | Ask your NotebookLM notebooks questions and get source-grounded, cited answers; keeps a library of your notebooks | [PleasePrompto/notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) (community, unofficial), in `.claude/skills/notebooklm`; drives a real Chrome window, so use it on **your own computer**; sign in once by asking "Set up NotebookLM authentication" |
| ECC (`ecc:*`, 293 skills, 68 agents, 94 commands) | Engineering workflows: TDD, code review, security, planning, language and framework skills, operator workflows | [affaan-m/ECC](https://github.com/affaan-m/ECC) v2.2.3 official plugin, installed by `install.sh` with its hooks off (needs the `claude` CLI) |
| AI co-writing (11 skills) | Voice DNA, ICP and business profiles, then LinkedIn posts, X threads, Substack notes, sales emails, how-to guides, thought leadership, bios, LinkedIn profile | Uploaded `ai-co-writing-claude-skills` zip (`voice-dna-creator` also uploaded on its own), in `.claude/skills/` |
| motion-primitives | 33 animated React components (text effects, morphing dialog, dock, carousel, spotlight, tilt...) built with Motion and Tailwind; adds them by CLI or copies the vendored source | [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) (MIT), in `.claude/skills/motion-primitives` |
| find-skills (Skills CLI, `npx skills`) | Searches the open skills ecosystem (skills.sh) for a skill that fits a task and installs it | [vercel-labs/skills](https://github.com/vercel-labs/skills) v1.7.0 (MIT), in `.claude/skills/find-skills`; the CLI runs with `npx`, nothing to install. Search needs `skills.sh`, which this cloud environment blocks |
| Anthropic official plugins (17) | Core: skill-creator, playground, claude-md-management, claude-code-setup, session-report. Design: canva, figma, adobe-for-creativity, superdesign, miro. Video: runway-api. Code: code-review, pr-review-toolkit, feature-dev, commit-commands, code-simplifier, security-guidance | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) marketplace (315 plugins, browse with `/plugin`), installed by `install.sh` (needs the `claude` CLI) |
| claudedesignskills (22 skills) | Three.js, R3F, GSAP, Motion, Babylon.js, Lottie, Rive, Spline and more | [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills), in `.claude/skills/` |

## Use in every project

On any computer, install once at user level (`~/.claude`):

```bash
git clone https://github.com/vigneshwaranm-crypto/auto.git ~/claude-skills
bash ~/claude-skills/install.sh
```

To update later: `git -C ~/claude-skills pull && bash ~/claude-skills/install.sh`.

### Claude Code on the web (cloud sessions)

Cloud containers start fresh each session, so the install has to run every
time. This repo is private, so the clone needs a read-only GitHub token:

1. On GitHub, create a fine-grained personal access token with access to only
   this repository and **Contents: Read-only**.
2. In the cloud environment's settings (environment menu in the session title
   bar → Edit), add it as an environment variable named `GITHUB_TOKEN`.
3. Put this in the **Setup script**. Environment variables are not available
   while the setup script runs, so it only registers a session-start hook;
   the hook runs the install in the background once the session has started
   and `GITHUB_TOKEN` is set. It never blocks or fails the session. Skills
   appear within a few minutes; plugins (HyperFrames, ECC) may need the next
   session. The log is at `/tmp/skills-setup.log`.

```bash
mkdir -p ~/.claude
cat > ~/.claude/install-skills.sh <<'EOF'
#!/bin/bash
# Runs when a session starts, once GITHUB_TOKEN is available. Once per container.
[ -e /tmp/skills-setup.started ] && exit 0
touch /tmp/skills-setup.started
{
  echo "token: ${GITHUB_TOKEN:+present}"
  git clone --depth 1 "https://x-access-token:${GITHUB_TOKEN}@github.com/vigneshwaranm-crypto/auto.git" /tmp/claude-skills \
    && WITH_VIDEO_DEPS=1 bash /tmp/claude-skills/install.sh \
    && echo "skills installed"
} > /tmp/skills-setup.log 2>&1
EOF
python3 - <<'EOF'
import json, os
p = os.path.expanduser("~/.claude/settings.json")
s = json.load(open(p)) if os.path.exists(p) else {}
s.setdefault("hooks", {}).setdefault("SessionStart", []).append(
    {"hooks": [{"type": "command", "command": "nohup bash ~/.claude/install-skills.sh >/dev/null 2>&1 &"}]})
json.dump(s, open(p, "w"), indent=2)
EOF
true
```

Sessions opened on this repo itself load everything from `.claude/` with no
setup.

## Video toolkit notes

The toolkit is installed to `~/.claude/video-toolkit`, and the `video-toolkit`
skill runs everything from there, so it works from any project. Your API keys
go in `~/.claude/video-toolkit/.env` (copy `.env.example`); re-running
`install.sh` never overwrites `.env` or `projects/`. Its slash commands
(`/video`, `/setup`, `/brand`, ...) are available when Claude Code is opened in
`~/.claude/video-toolkit` itself. Run `install.sh` with `WITH_VIDEO_DEPS=1` to
also install its Python packages (needs `uv`). Cloud GPU features need a Modal
or RunPod account, set up with `/setup`.

## HyperFrames notes

Rendering uses `npx hyperframes` (Node, FFmpeg and a headless Chrome, which
`npx hyperframes browser ensure` sets up; `npx hyperframes doctor` checks
everything). Compositions load GSAP from `cdn.jsdelivr.net`; where that host
is blocked (some cloud sandboxes), load it from npm into the project instead.
Set `HYPERFRAMES_NO_TELEMETRY=1` to turn off its anonymous usage telemetry.

## Writing profiles

Client profiles live in `writing/clients/<client>/` (see
[writing/clients/README.md](writing/clients/README.md)), one folder per client,
installed to `~/.claude/writing/clients/`. The writing skills ask which client
you're writing for and read only that client's profiles. The repo copy always
wins, so edit and commit them here.

Your personal profiles work the same way, below.


The co-writing skills share three profiles in `~/.claude/writing/context/`:
`voice-dna.json`, `icp.json` and `business-profile.json`, plus source notes
and drafts in `~/.claude/writing/knowledge/`. They start as templates; run
`voice-dna-creator`, `icp-creator` and `business-profile-creator` to fill them.
`install.sh` never overwrites a profile that already exists.

Cloud sessions start empty, so to keep your real profiles everywhere, copy
the filled-in files into this repo's `writing/context/` and commit them.

## NotebookLM notes

Google has no public NotebookLM API, so this server uses your signed-in Google
session. `install.sh` sets it up only on your own computer (cloud sessions skip
it) and pins the version, because it otherwise updates itself. After
installing, run `notebooklm-mcp-server auth` once: a browser opens, you sign in
to Google, and the session is saved to `~/.notebooklm-mcp/auth.json`. That file
is your Google login: never commit or share it. If Google rejects the session
right after sign-in, your account enforces device-bound sessions, which this
server cannot work with.

The `notebooklm` skill is a second, separate route: it asks questions of
notebooks by driving Chrome, and saves its own Google login and notebook
library in `~/.claude/skills/notebooklm/data/`. `install.sh` keeps that folder
(and any skill's `data/` and `.venv/`) when it re-installs, and this repo
ignores them so a login can never be committed. The MCP server can create
notebooks and generate audio overviews; the skill is for asking questions.

## Official plugins notes

- Design plugins (Canva, Figma, Adobe, Miro) connect to each service's MCP
  server and ask you to sign in the first time you use them. Superdesign
  needs `superdesign login`.
- runway-api needs a Runway API key as the `RUNWAYML_API_SECRET` environment
  variable, plus `uv`.
- security-guidance runs hooks: regex warnings on every edit, an LLM review
  of the diff at the end of each turn that changed code (extra model usage),
  and a deeper review on `git commit`. Turn it off with
  `SECURITY_GUIDANCE_DISABLE=1`, or only the per-turn review with
  `ENABLE_STOP_REVIEW=0`.

## Not enabled

ECC ships 24 hooks (quality checks, command blocking, cost tracking, memory
between sessions) that run on every command, edit and turn. `install.sh`
installs ECC with them off. To turn them on, run
`/plugin configure ecc@ecc` in Claude Code and set `hooks_enabled` to true;
re-running `install.sh` keeps that choice.

unlazy has an optional Stop hook that blocks Claude from finishing while
gates are unmet. It is not installed; to add it to one project, run
`node ~/.claude/skills/unlazy/scripts/install-hooks.mjs` there.

Impeccable ships hooks that run its design checker after every edit and at
the end of each turn. They are not installed. To turn them on in a project,
merge Impeccable's `.claude/settings.json` hooks into that project's
settings.
