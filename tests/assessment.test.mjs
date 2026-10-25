import test from 'node:test';
import { request as httpRequest } from 'node:http';
import assert from 'node:assert/strict';
import { createAssessmentHandler, createRateLimiter } from '../server/assessment.mjs';
import { createAssessmentServer } from '../server/http.mjs';
const origin = 'https://artemiskit.vorbtech.com.ng';
const valid = { name: 'Demo Requester', email: 'requester@example.com', organisation: 'Example Organisation', role: 'Engineering', sector: 'Public sector', goal: 'Deployment review', workflow: 'Answer synthetic service questions and escalate exceptions for review.', target: 'A staging support assistant using synthetic fixtures.', risks: 'Disclosure of synthetic account information or an unauthorised action.', rules: 'Escalate restricted decisions.', success: 'Approved rules are respected.', dataAccess: 'Synthetic records only.', stakeholders: 'Engineering and privacy owners.', timing: 'To be discussed', budget: '', consent: true, website: '' };
function setup({ env, send } = {}) {
  let clock = 100000;
  const calls = [];
  const handle = createAssessmentHandler({ env: env || { RESEND_API_KEY: 'not-a-real-key', EMAIL_BCC: 'override@example.com' }, now: () => clock, send: send || (async (url, options) => { calls.push({ url, options }); return Response.json({ id: 'provider-id' }); }) });
  async function getToken(requestOrigin = origin) { const response = await handle(new Request(origin + '/api/assessment', { headers: { Origin: requestOrigin } }), { clientId: 'test' }); const body = await response.json(); return { response, ...body }; }
  async function post(token, data = valid, requestOrigin = origin) { return handle(new Request(origin + '/api/assessment', { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, token }) }), { clientId: 'test' }); }
  return { handle, calls, getToken, post, advance: n => { clock += n; } };
}
test('valid request uses fixed admin notification, BCC and requester reply-to', async () => {
  const s = setup(); const session = await s.getToken(); s.advance(3000);
  const response = await s.post(session.token); assert.equal(response.status, 200);
  assert.equal((await response.json()).accepted, true);
  const payload = JSON.parse(s.calls[0].options.body);
  assert.deepEqual(payload.to, ['admin@vorbtech.com.ng']); assert.deepEqual(payload.bcc, ['tsowababangida@gmail.com']); assert.equal(payload.reply_to, valid.email);
  assert.equal(payload.from, 'ArtemisKit by Vorbtech <artemiskit@vorbtech.com.ng>');
  assert.match(payload.html, /artemiskit-logo\.png/);
  assert.equal(s.calls.length, 2);
  const acknowledgement = JSON.parse(s.calls[1].options.body);
  assert.deepEqual(acknowledgement.to, [valid.email]);
  assert.deepEqual(acknowledgement.bcc, ['tsowababangida@gmail.com']);
  assert.equal(acknowledgement.reply_to, 'admin@vorbtech.com.ng');
  assert.match(acknowledgement.text, /representative.*get back to you soon/);
  assert.match(acknowledgement.html, /We’ve received your request/);
  assert.ok(!acknowledgement.text.includes(valid.workflow));
  assert.ok(!acknowledgement.html.includes(valid.risks));
  assert.equal(s.calls[0].url, 'https://api.resend.com/emails'); assert.match(payload.text, /Success criteria\nApproved rules/);
});
test('no key never produces a successful receipt or sends email', async () => { const s = setup({ env: {} }); const response = await s.post('anything'); assert.equal(response.status, 503); assert.equal(s.calls.length, 0); });
test('requires consent and valid email without sending', async () => { const s = setup(); const session = await s.getToken(); s.advance(3000); const response = await s.post(session.token, { ...valid, consent: false, email: 'bad\r\nBcc: injected@example.com' }); assert.equal(response.status, 422); const { errors } = await response.json(); assert.ok(errors.email && errors.consent); assert.equal(s.calls.length, 0); });
test('rejects a foreign origin and missing Origin on submission', async () => { const s = setup(); const session = await s.getToken(); s.advance(3000); assert.equal((await s.post(session.token, valid, 'https://unrelated.example')).status, 403); const response = await s.handle(new Request(origin+'/api/assessment', { method: 'POST', body: '{}' })); assert.equal(response.status, 403); assert.equal(s.calls.length, 0); });
test('tampered, expired and too-fast tokens are rejected', async () => { const s = setup(); const session = await s.getToken(); assert.equal((await s.post(session.token)).status, 429); s.advance(3000); assert.equal((await s.post(session.token+'x')).status, 409); s.advance(3600001); assert.equal((await s.post(session.token)).status, 409); assert.equal(s.calls.length, 0); });
test('honeypot and recipient override fields do not send', async () => { const s = setup(); const session = await s.getToken(); s.advance(3000); assert.equal((await s.post(session.token, {...valid,website:'spam.example'})).status, 422); assert.equal((await s.post(session.token, {...valid,to:'attacker@example.com'})).status, 422); assert.equal(s.calls.length, 0); });
test('rejects huge or malformed requests before delivery', async () => { const s = setup(); const session = await s.getToken(); s.advance(3000); assert.equal((await s.post(session.token,{...valid,workflow:'x'.repeat(25000)})).status, 413); const response=await s.handle(new Request(origin+'/api/assessment',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{broken'}));assert.equal(response.status,400);assert.equal(s.calls.length,0); });
test('Resend rejection, timeout and missing delivery id never show acceptance', async () => { for (const send of [async()=>new Response('provider diagnostic',{status:403}), async()=>{throw new Error('secret diagnostic')}, async()=>Response.json({})]) { const s=setup({send});const session=await s.getToken();s.advance(3000);const response=await s.post(session.token);assert.equal(response.status,502);const body=await response.json();assert.equal(body.accepted,undefined);assert.doesNotMatch(JSON.stringify(body),/secret diagnostic|provider diagnostic/); } });
test('same logical submission preserves Resend idempotency key after an uncertain send', async()=>{const sent=[];const s=setup({send:async(url,options)=>{sent.push(options);if(sent.length===1)throw new Error('network lost');return Response.json({id:'accepted'})}});const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token)).status,502);assert.equal((await s.post(session.token)).status,200);assert.equal(sent[0].headers['Idempotency-Key'],sent[1].headers['Idempotency-Key']);assert.equal(sent[0].body,sent[1].body);});
test('rate limiter bounds requests, expires entries and refuses excess cardinality',()=>{const limit=createRateLimiter({maximumEntries:2});assert.equal(limit('one',0,1,10),true);assert.equal(limit('one',1,1,10),false);assert.equal(limit('two',1,1,10),true);assert.equal(limit('three',2,1,10),false);assert.equal(limit('three',12,1,10),true);});
test('token refresh retains request identity for a retry',async()=>{const s=setup();const first=await s.getToken();const response=await s.handle(new Request(origin+'/api/assessment?requestId='+first.requestId));assert.equal(response.status,200);assert.equal((await response.json()).requestId,first.requestId);});
test('HTML templates escape user input while retaining the plain-text alternative',async()=>{const s=setup();const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token,{...valid,name:'<img src=x onerror="bad">',workflow:'<script>alert("x")</script> A synthetic workflow description.'})).status,200);const payload=JSON.parse(s.calls[0].options.body);assert.ok(payload.text.includes('<script>'));assert.ok(payload.html.includes('&lt;script&gt;'));assert.ok(!payload.html.includes('<script>'));const acknowledgement=JSON.parse(s.calls[1].options.body);assert.ok(acknowledgement.html.includes('&lt;img src=x onerror=&quot;bad&quot;&gt;'));assert.ok(!acknowledgement.html.includes('<img src=x'));});
test('acknowledgement failure keeps the request retryable without duplicating the team notification',async()=>{
  const cache=new Map();const attempts=[];let failAcknowledgement=true;let physicalSends=0;
  const s=setup({send:async(_url,options)=>{
    const key=options.headers['Idempotency-Key'];attempts.push({key,body:options.body});
    if(cache.has(key))return Response.json(cache.get(key));
    if(key.includes('/acknowledgement/')&&failAcknowledgement){failAcknowledgement=false;throw Error('uncertain acknowledgement');}
    const result={id:`email-${++physicalSends}`};cache.set(key,result);return Response.json(result);
  }});
  const session=await s.getToken();s.advance(3000);
  const failed=await s.post(session.token);assert.equal(failed.status,502);assert.equal((await failed.json()).accepted,undefined);
  const retried=await s.post(session.token);assert.equal(retried.status,200);assert.match((await retried.json()).message,/confirmation email/);
  assert.equal(physicalSends,2);assert.equal(attempts.length,4);
  assert.notEqual(attempts[0].key,attempts[1].key);
  assert.equal(attempts[0].key,attempts[2].key);assert.equal(attempts[0].body,attempts[2].body);
  assert.equal(attempts[1].key,attempts[3].key);assert.equal(attempts[1].body,attempts[3].body);
});
test('a team notification failure never sends an acknowledgement',async()=>{
  const calls=[];const s=setup({send:async(_url,options)=>{calls.push(options);return new Response('',{status:403});}});
  const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token)).status,502);
  assert.equal(calls.length,1);assert.match(calls[0].headers['Idempotency-Key'],/\/team\//);
});
test('a requester who is the fixed BCC recipient receives one acknowledgement copy',async()=>{
  const s=setup();const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token,{...valid,email:'TsowaBabangida@gmail.com'})).status,200);
  const acknowledgement=JSON.parse(s.calls[1].options.body);assert.deepEqual(acknowledgement.to,['TsowaBabangida@gmail.com']);assert.equal(acknowledgement.bcc,undefined);
  assert.deepEqual(JSON.parse(s.calls[0].options.body).bcc,['tsowababangida@gmail.com']);
});
test('acknowledgement rejection or missing provider id never produces a receipt',async()=>{
  for(const second of [()=>new Response('',{status:403}),()=>Response.json({})]){
    let sends=0;const s=setup({send:async()=>++sends===1?Response.json({id:'team-id'}):second()});
    const session=await s.getToken();s.advance(3000);const response=await s.post(session.token);
    assert.equal(response.status,502);assert.equal((await response.json()).accepted,undefined);assert.equal(sends,2);
  }
});
test('sender branding preserves the configured mailbox and uses public logo and site links',async()=>{
  for(const sender of ['artemiskit@vorbtech.com.ng','Old display name <artemiskit@vorbtech.com.ng>']){
    const s=setup({env:{RESEND_API_KEY:'not-real',EMAIL_FROM:sender,VERCEL_URL:'preview.example.com',EMAIL_SITE_URL:'https://site.example.com/',EMAIL_LOGO_URL:'https://assets.example.com/logo.png'}});
    const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token)).status,200);
    for(const call of s.calls){const payload=JSON.parse(call.options.body);assert.equal(payload.from,'ArtemisKit by Vorbtech <artemiskit@vorbtech.com.ng>');assert.match(payload.html,/https:\/\/assets\.example\.com\/logo\.png/);assert.match(payload.html,/href="https:\/\/site\.example\.com\//);}
  }
  for(const deployment of [{VERCEL_URL:'deployment.example.com'},{VERCEL_BRANCH_URL:'branch.example.com',VERCEL_URL:'deployment.example.com'},{VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'public.example.com'}]){
    const s=setup({env:{RESEND_API_KEY:'not-real',...deployment}});const session=await s.getToken();s.advance(3000);assert.equal((await s.post(session.token)).status,200);
    const email=JSON.parse(s.calls[1].options.body);assert.match(email.html,/href="https:\/\/artemiskit\.vorbtech\.com\.ng\//);assert.match(email.text,/Explore ArtemisKit: https:\/\/artemiskit\.vorbtech\.com\.ng\//);assert.match(email.html,/src="https:\/\/artemiskit\.vercel\.app\/artemiskit-logo\.png/);
  }
});
test('invalid sender, recipient or public URL configuration fails before sending',async()=>{
  for(const extra of [{EMAIL_FROM:'bad\r\nBcc: attacker@example.com'},{EMAIL_FROM:'not-an-address'},{ADMIN_EMAIL:'admin@example.com,attacker@example.com'},{EMAIL_SITE_URL:'javascript:alert(1)'},{EMAIL_SITE_URL:'https://user:password@example.com'},{EMAIL_LOGO_URL:'http://assets.example.com/logo.png'},{EMAIL_LOGO_URL:'https://user:password@example.com/logo.png'}]){
    const s=setup({env:{RESEND_API_KEY:'not-real',...extra}});const result=await s.getToken();assert.equal(result.response.status,503);assert.equal(s.calls.length,0);
  }
});
test('standalone HTTP adapter enforces route and delivers through the shared handler',async t=>{let sends=0;const server=createAssessmentServer({env:{RESEND_API_KEY:'not-real',ASSESSMENT_ALLOWED_ORIGINS:origin},now:()=>100000,send:async()=>{sends++;return Response.json({id:'id'})}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));const url=`http://127.0.0.1:${server.address().port}`;assert.equal((await fetch(url+'/unexpected')).status,404);const result=await fetch(url+'/api/assessment',{headers:{Origin:origin}});assert.equal(result.status,200);assert.ok((await result.json()).token);assert.equal(sends,0);});
test('TLS reverse-proxy GET token works without a browser Origin header',async t=>{const server=createAssessmentServer({env:{RESEND_API_KEY:'not-real'},trustProxy:true,send:async()=>{throw Error('must not send')}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));const response=await new Promise((resolve,reject)=>{const req=httpRequest({host:'127.0.0.1',port:server.address().port,path:'/api/assessment',headers:{Host:'artemiskit.vorbtech.com.ng','X-Forwarded-Proto':'https','X-Real-IP':'192.0.2.1'}},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,body:JSON.parse(body)}))});req.on('error',reject);req.end()});assert.equal(response.status,200);assert.ok(response.body.token);});
