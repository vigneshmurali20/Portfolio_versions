# My Claude Code skills

Every skill I use, kept in one place so it can be installed into any project
or session.

| Skill set | What it does | Source |
| --- | --- | --- |
| Claude SEO (`/seo`, 33 skills, 19 agents) | Site audits, technical SEO, schema, GEO/AI search, local, e-commerce | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.4.1, installed by `install.sh` |
| img2threejs | Rebuild an object in a reference image as a procedural Three.js model | [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) v2.0.0, in `.claude/skills/img2threejs` |
| Impeccable (`/impeccable`, 4 agents) | Frontend design: audit, critique, polish, redesign | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v4.5.0, in `.claude/skills/impeccable` |
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
time. Add this to the cloud environment's **Setup script** (environment menu
in the session title bar → Edit). It runs for every repo that uses that
environment:

```bash
git clone --depth 1 https://github.com/vigneshwaranm-crypto/auto.git /tmp/claude-skills \
  && bash /tmp/claude-skills/install.sh
```

This repo is private, so the clone needs GitHub access in the setup script.
If it fails with an authentication error, add a read-only GitHub token as an
environment secret and clone with
`https://x-access-token:${GITHUB_TOKEN}@github.com/vigneshwaranm-crypto/auto.git`.

Sessions opened on this repo itself load everything from `.claude/` with no
setup.

## Not enabled

Impeccable ships hooks that run its design checker after every edit and at
the end of each turn. They are not installed. To turn them on in a project,
merge Impeccable's `.claude/settings.json` hooks into that project's
settings.
