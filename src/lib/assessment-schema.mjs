export const fields = [
  { name: 'name', label: 'Your name', min: 2, max: 100, required: true, step: 1, singleLine: true },
  { name: 'email', label: 'Work email', min: 3, max: 254, required: true, step: 1, singleLine: true },
  { name: 'organisation', label: 'Organisation', min: 2, max: 160, required: true, step: 1, singleLine: true },
  { name: 'role', label: 'Your role', max: 120, step: 1, singleLine: true },
  { name: 'sector', label: 'Sector', max: 100, step: 1, singleLine: true },
  { name: 'goal', label: 'Decision you need to make', min: 3, max: 100, required: true, step: 1, singleLine: true },
  { name: 'workflow', label: 'The workflow', min: 20, max: 1600, required: true, step: 2 },
  { name: 'target', label: 'The target system', min: 5, max: 1000, required: true, step: 2 },
  { name: 'risks', label: 'Failures that matter most', min: 10, max: 1200, required: true, step: 2 },
  { name: 'rules', label: 'Rules and boundaries', max: 1200, step: 2 },
  { name: 'success', label: 'Success criteria', max: 1200, step: 2 },
  { name: 'dataAccess', label: 'Test data and access', max: 1000, step: 2 },
  { name: 'stakeholders', label: 'Review stakeholders', max: 600, step: 2 },
  { name: 'timing', label: 'Timing and constraints', max: 600, step: 2 },
  { name: 'budget', label: 'Budget context', max: 300, step: 2, singleLine: true },
];
export const goals = ['Deployment review', 'Model selection', 'Investigate or improve behaviour', 'Agent workflow assessment', 'Model provider assessment', 'Other / help me scope it'];
export const emailPattern = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
export function validateAssessment(input, step) {
  /** @type {Record<string, string>} */
  const errors = {};
  /** @type {Record<string, string>} */
  const value = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { value, errors: { form: 'Enter a valid assessment request.' } };
  for (const field of fields) {
    if (step && field.step !== step) continue;
    const raw = input[field.name];
    if (raw !== undefined && typeof raw !== 'string') { errors[field.name] = `${field.label} must be text.`; continue; }
    const text = (raw || '').trim();
    value[field.name] = text;
    if (field.required && text.length < field.min) errors[field.name] = `${field.label}: please add ${field.min === 2 ? 'at least 2 characters' : `at least ${field.min} characters`}.`;
    else if (text.length > field.max) errors[field.name] = `${field.label}: use ${field.max} characters or fewer.`;
    else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text) || (field.singleLine && /[\r\n]/.test(text))) errors[field.name] = `${field.label} contains unsupported characters.`;
  }
  if ((!step || step === 1) && value.email && !emailPattern.test(value.email)) errors.email = 'Enter a valid email address.';
  if ((!step || step === 1) && value.goal && !goals.includes(value.goal)) errors.goal = 'Choose one of the assessment goals.';
  if (!step && input.consent !== true) errors.consent = 'Confirm that VIS may review and respond to this request.';
  return { value, errors };
}
