import { createAssessmentHandler } from '../server/assessment.mjs';
const handle = createAssessmentHandler();
// Vercel supplies the forwarded client address. Do not use this adapter on a generic proxy.
export default { fetch: request => handle(request, { clientId: request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown' }) };
