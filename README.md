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
| AI co-writing (11 skills) | Voice DNA, ICP and business profiles, then LinkedIn posts, X threads, Substack notes, sales emails, how-to guides, thought leadership, bios, LinkedIn profile | Uploaded `ai-co-writing-claude-skills` zip (`voice-dna-creator` also uploaded on its own), in `.claude/skills/` |
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
3. Put this in the **Setup script**. It never fails the session: if the
   install can't run, the session still starts without the skills.

```bash
if [ -n "${GITHUB_TOKEN:-}" ] \
  && git clone --depth 1 "https://x-access-token:${GITHUB_TOKEN}@github.com/vigneshwaranm-crypto/auto.git" /tmp/claude-skills \
  && WITH_VIDEO_DEPS=1 bash /tmp/claude-skills/install.sh; then
  echo "skills installed"
else
  echo "skills install skipped or failed; continuing without them"
fi
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

The co-writing skills share three profiles in `~/.claude/writing/context/`:
`voice-dna.json`, `icp.json` and `business-profile.json`, plus source notes
and drafts in `~/.claude/writing/knowledge/`. They start as templates; run
`voice-dna-creator`, `icp-creator` and `business-profile-creator` to fill them.
`install.sh` never overwrites a profile that already exists.

Cloud sessions start empty, so to keep your real profiles everywhere, copy
the filled-in files into this repo's `writing/context/` and commit them.

## Not enabled

Impeccable ships hooks that run its design checker after every edit and at
the end of each turn. They are not installed. To turn them on in a project,
merge Impeccable's `.claude/settings.json` hooks into that project's
settings.
