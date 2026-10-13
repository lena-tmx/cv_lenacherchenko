const fs = require('node:fs');
const path = require('node:path');
const cv = require('../cv-content.json');
const root = path.resolve(__dirname, '..');
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const section = (title, body, className = '') =>
  `<section class="section ${className}"><h2>${escape(title)}</h2>${body}</section>`;
const paragraph = (text) => `<p>${escape(text)}</p>`;
const summary = section('Professional Summary', paragraph(cv.summary), 'summary');
const skills = section(
  'Skills',
  cv.skills
    .map(([title, text]) => `<div class="skill"><h3>${escape(title)}</h3>${paragraph(text)}</div>`)
    .join(''),
);
const experience = section(
  'Work Experience',
  `
  <div class="employer"><h3>${escape(cv.employer)} <span class="dates">${escape(cv.employmentDates)}</span></h3>${paragraph(cv.employerDescription)}</div>
  ${cv.roles.map((role) => `<article class="role"><h3>${escape(role.title)} <span class="dates">${escape(role.dates)}</span></h3>${role.note ? `<p class="promotion">${escape(role.note)}</p>` : ''}<ul>${role.bullets.map((text) => `<li>${escape(text)}</li>`).join('')}</ul></article>`).join('')}
  ${cv.earlierExperience.map((job) => `<article class="earlier"><h3>${escape(job.title)} <span class="dates">${escape(job.dates)}</span></h3><p class="meta">${escape(job.company)}</p>${paragraph(job.text)}</article>`).join('')}
  <div class="additional"><h3>Additional Experience</h3>${paragraph(cv.additionalExperience)}</div>
`,
);
const portfolio = section(
  'Technical Portfolio',
  `<h3><a href="${escape(cv.portfolio.url)}">${escape(cv.portfolio.title)}</a></h3>${paragraph(cv.portfolio.description)}<p class="stack">${escape(cv.portfolio.stack)}</p>`,
);
const credentials =
  section('Certifications', paragraph(cv.certification)) +
  section('Education', paragraph(cv.education)) +
  section('Relevant Training', paragraph(cv.training)) +
  section('Languages', paragraph(cv.languages));
for (const variant of ['designed', 'ats']) {
  const ats = variant === 'ats';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lena Cherchenko – QA Engineer CV${ats ? ' – ATS' : ''}</title><meta name="description" content="ISTQB certified QA Engineer: manual and automation testing, Playwright, TypeScript, APIs and microservices."><link rel="stylesheet" href="style.css">${ats ? '<link rel="stylesheet" href="ats.css">' : ''}</head>
<body class="${variant}">
<nav class="toolbar" aria-label="CV versions"><a href="${ats ? 'index.html' : 'ats.html'}">${ats ? 'View designed CV' : 'View ATS CV'}</a><button type="button" onclick="window.print()">Save as PDF</button></nav>
<div class="page">
<header class="header">${ats ? '' : '<img class="profile-photo" src="photo-optimized.jpg" alt="Lena Cherchenko" width="84" height="84">'}<div class="identity"><h1>${escape(cv.name)}</h1><p class="headline">${escape(cv.headline)}</p><p class="location">${escape(cv.location)}</p><div class="contact"><a href="mailto:${escape(cv.email)}">${escape(cv.email)}</a><a href="tel:+41765886645">${escape(cv.phone)}</a><a href="${escape(cv.linkedin)}">linkedin.com/in/lena-ch</a></div></div></header>
${summary}
${ats ? `<main>${skills}${experience}${portfolio}${credentials}</main>` : `<div class="layout"><aside>${skills}${portfolio}${credentials}</aside><main>${experience}</main></div>`}
</div></body></html>`;
  fs.writeFileSync(path.join(root, 'public', ats ? 'ats.html' : 'index.html'), html);
}
console.log('Built both CV versions from cv-content.json');
