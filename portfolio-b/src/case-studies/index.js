/*
 * Case studies, exported from the Figma file "Repo" (one page per study).
 * Each <slug>.json holds the hero text and the module list; the module
 * images live in public/case-studies/<slug>/. Read at build time only
 * (templates.js and vite.config.js), never shipped to the browser.
 */
import { readFileSync, existsSync } from 'node:fs';

// Home-page order, and the short card copy the Figma pages do not carry.
export const caseStudyOrder = [
  { slug: 'omni-tracker', kind: 'Product · Admin + client portal', accent: '#7f56d9' },
  { slug: 'omnicommerce', kind: 'Website · B2B SaaS', accent: '#0a69c2' },
  { slug: 'omni-crm', kind: 'Product · CRM + MCP', accent: '#3fae5a' },
  { slug: 'agent-canvas', kind: 'Internal tool · Claude agents', accent: '#d97757' },
  { slug: 'jev-laya', kind: 'Automation · Local AI', accent: '#f0a23b' },
];

const load = (slug) => {
  const url = new URL(`./${slug}.json`, import.meta.url);
  if (!existsSync(url)) return null;
  return JSON.parse(readFileSync(url, 'utf8'));
};

export const caseStudies = caseStudyOrder
  .map((o) => {
    const d = load(o.slug);
    return d ? { ...o, ...d, base: `case-studies/${o.slug}/` } : null;
  })
  .filter(Boolean);

export const findCaseStudy = (slug) => caseStudies.find((c) => c.slug === slug);
