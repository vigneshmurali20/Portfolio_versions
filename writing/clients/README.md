# Client profiles

One folder per client. Each holds the three profiles the writing skills read:

| File | What it is | Made with |
| --- | --- | --- |
| `voice-dna.json` | How the client writes: personality, tone, phrases, never-say list | `voice-dna-creator` |
| `icp.json` | Who the client writes for | `icp-creator` |
| `business-profile.json` | What the client sells and how it's positioned | `business-profile-creator` |

Folder names are lowercase with hyphens (`grassdoor`, `acme-coffee`).
`install.sh` copies this folder to `~/.claude/writing/clients/`, and the copy
in this repo always wins, so edit profiles here and commit them.

Your own personal profiles stay in `writing/context/`, separate from clients.

## Clients

| Client | Profiles | Built from | Updated |
| --- | --- | --- | --- |
| [Grassdoor](grassdoor/) | voice DNA, ICP, business profile | Brand context handover, Brand Book, Copy Playbook (Grassdoor Copy and Creative project) | 2026-10-03 |
