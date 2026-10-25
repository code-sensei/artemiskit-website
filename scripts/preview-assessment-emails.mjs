import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAssessmentEmails } from '../server/assessment-emails.mjs';

if (!process.argv[2]) throw new Error('Usage: node scripts/preview-assessment-emails.mjs /absolute/output-directory [https://website-origin]');
const output = resolve(process.argv[2]);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const website = new URL(process.argv[3] || 'https://artemiskit.vercel.app');
if (website.protocol !== 'https:' || website.username || website.password) throw new Error('Use the public HTTPS website origin for preview links.');
const value = {
  name: 'Alex Morgan', email: 'alex@example.org', organisation: 'Example Organisation', role: 'Product lead',
  sector: 'Enterprise operations', goal: 'Deployment review',
  workflow: 'A support assistant answers questions from approved documentation and escalates account changes to a person.',
  target: 'A staging assistant with synthetic support records.',
  risks: 'Disclosing another customer’s information or taking an action without approval.',
  rules: 'Use approved sources. Escalate restricted decisions.', success: 'Clear answers and a reliable handoff when permission is missing.',
  dataAccess: 'Synthetic data only.', stakeholders: 'Product and engineering owners.', timing: 'To be discussed.', budget: '',
};
const emails = buildAssessmentEmails({ value, reference: 'AK-PREVIEW-EXAMPLE', siteUrl: website.origin, logoUrl: 'http://127.0.0.1:4186/artemiskit-logo.png' });
await mkdir(output, { recursive: true });
for (const [name, email] of Object.entries(emails)) {
  await writeFile(resolve(output, `${name}.html`), email.html);
  await writeFile(resolve(output, `${name}.txt`), `${email.subject}\n\n${email.text}\n`);
}
await copyFile(resolve(root, 'public/artemiskit-logo.png'), resolve(output, 'artemiskit-logo.png'));
console.log(`Synthetic previews written to ${output}. No emails were sent.`);
