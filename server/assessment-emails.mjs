import { fields } from '../src/lib/assessment-schema.mjs';

export const SENDER_NAME = 'ArtemisKit by Vorbtech';
export const PUBLIC_LOGO_URL = 'https://artemiskit.vercel.app/artemiskit-logo.png';
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const paragraph = content => `<p style="margin:0 0 20px;font-size:16px;line-height:1.65;">${content}</p>`;

function layout({ title, preheader, reference, content, siteUrl, logoUrl }) {
  const site = escape(siteUrl);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(title)}</title>
<style>body{margin:0;padding:0}table{border-collapse:collapse}a{color:#A23E00}img{border:0;display:block;max-width:100%;height:auto}@media(max-width:620px){.email-pad{padding:24px!important}.email-title{font-size:28px!important}.email-outer{padding:12px!important}}</style></head>
<body style="margin:0;background-color:#EAE8E0;color:#0D1115;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escape(preheader)}</div>
<table role="presentation" width="100%" style="background-color:#EAE8E0;"><tr><td class="email-outer" align="center" style="padding:32px 16px;">
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" width="600" style="width:100%;max-width:600px;background-color:#F5F3EC;border:1px solid #D7D6CE;">
<tr><td class="email-pad" style="padding:30px 36px;border-top:6px solid #FF7A18;background-color:#0D1115;">
<a href="${site}/" style="text-decoration:none;color:#F5F3EC;"><img src="${escape(logoUrl)}" width="210" height="45" alt="ArtemisKit" style="width:210px;max-width:100%;height:auto;"></a>
<p style="margin:16px 0 0;font-size:11px;line-height:1.5;letter-spacing:1.4px;color:#F5F3EC;">AI ASSURANCE BY VORBTECH</p></td></tr>
<tr><td class="email-pad" style="padding:32px 36px;background-color:#0D1115;color:#F5F3EC;">
<h1 class="email-title" style="margin:0;font-size:34px;line-height:1.18;font-weight:600;color:#F5F3EC;">${escape(title)}</h1>
<p style="margin:22px 0 5px;font-size:11px;letter-spacing:1.4px;color:#F5F3EC;">REQUEST REFERENCE</p>
<p style="margin:0;font-family:Consolas,monospace;font-size:15px;line-height:1.6;color:#FF7A18;">${escape(reference)}</p></td></tr>
<tr><td class="email-pad" style="padding:32px 36px;">${content}</td></tr>
<tr><td class="email-pad" style="padding:24px 36px;border-top:1px solid #D7D6CE;">
<p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#5B5E60;">ArtemisKit is an open-source project by<br><a href="https://www.vorbtech.com.ng/" style="color:#A23E00;">Vorbtech Innovative Solutions</a>.</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:#5B5E60;">This request does not authorise testing or create an engagement. Scope, access, data handling and terms will be agreed separately.</p></td></tr>
</table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
}

export function buildAssessmentEmails({ value, reference, siteUrl, logoUrl = PUBLIC_LOGO_URL }) {
  const notificationText = [
    'ArtemisKit AI Assurance assessment request', `Reference: ${reference}`, '',
    ...fields.flatMap(field => [field.label, value[field.name] || 'Not specified', '']),
    'Permission: The requester agreed to VIS reviewing and responding to this request.',
    'Reply to this email to contact the requester.',
    'This request does not authorise testing or create an engagement. Agree scope, access, data handling and terms separately.',
  ].join('\n');
  const details = fields.map(field => `<tr><td style="padding:0 0 18px;border-bottom:1px solid #D7D6CE;">
<p style="margin:18px 0 6px;font-size:12px;line-height:1.5;font-weight:bold;color:#5B5E60;">${escape(field.label)}</p>
<p style="margin:0;font-size:15px;line-height:1.65;overflow-wrap:anywhere;word-break:break-word;">${escape(value[field.name] || 'Not specified').replace(/\n/g, '<br>')}</p></td></tr>`).join('');
  const notification = {
    subject: `ArtemisKit assessment request · ${reference}`,
    text: notificationText,
    html: layout({ title: 'A new assessment request.', preheader: 'A workflow is ready for the VIS assessment team to review.', reference, siteUrl, logoUrl,
      content: paragraph('A requester has shared a workflow for review. Their details and assessment brief are below.') +
        `<table role="presentation" width="100%">${details}</table>` +
        `<div style="margin-top:24px;">${paragraph('Reply to this email to contact the requester.')}</div>` }),
  };
  const acknowledgement = {
    subject: `We’ve received your ArtemisKit request · ${reference}`,
    text: [
      `Hi ${value.name},`, '',
      'Thanks for getting in touch. We’ve received your ArtemisKit assessment request.',
      'A representative from Vorbtech Innovative Solutions will get back to you soon to discuss your workflow and next steps.', '',
      `Your reference: ${reference}`, '',
      'What happens next',
      '1. We review your request and the decision you need to make.',
      '2. A representative contacts you to discuss fit and any questions.',
      '3. We agree scope, access and terms before any testing begins.', '',
      'You can reply to this email if you need to add anything. Please keep passwords, API keys and sensitive records out of email.', '',
      `Explore ArtemisKit: ${siteUrl}/`, '',
      'ArtemisKit by Vorbtech', 'An open-source project by Vorbtech Innovative Solutions.',
      'This request does not authorise testing or create an engagement.',
    ].join('\n'),
    html: layout({ title: 'We’ve received your request.', preheader: 'A Vorbtech representative will get back to you soon.', reference, siteUrl, logoUrl,
      content: paragraph(`Hi ${escape(value.name)},`) +
        paragraph('Thanks for getting in touch. We’ve received your ArtemisKit assessment request. A representative from Vorbtech Innovative Solutions will get back to you soon to discuss your workflow and next steps.') +
        '<h2 style="margin:28px 0 14px;font-size:20px;line-height:1.4;">What happens next</h2>' +
        '<ol style="margin:0 0 24px;padding-left:22px;font-size:15px;line-height:1.8;"><li>We review your request and the decision you need to make.</li><li>A representative contacts you to discuss fit and any questions.</li><li>We agree scope, access and terms before any testing begins.</li></ol>' +
        paragraph('You can reply to this email if you need to add anything. Please keep passwords, API keys and sensitive records out of email.') +
        `<table role="presentation"><tr><td style="background-color:#FF7A18;"><a href="${escape(siteUrl)}/" style="display:inline-block;padding:14px 20px;color:#0D1115;font-size:15px;font-weight:bold;text-decoration:none;">Explore ArtemisKit &#8599;</a></td></tr></table>` }),
  };
  return { notification, acknowledgement };
}
