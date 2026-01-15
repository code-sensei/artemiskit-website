import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface WaitlistEntry {
  email: string;
  company_size?: string;
  use_case?: string;
  referral_source?: string;
}

export async function joinWaitlist(data: WaitlistEntry): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    // For development without Supabase
    console.log('Waitlist submission (dev mode):', data);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: data.email,
        company_size: data.company_size || null,
        use_case: data.use_case || null,
        referral_source: data.referral_source || (typeof document !== 'undefined' ? document.referrer : null) || 'direct',
      });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'This email is already on the waitlist!' };
      }
      console.error('Supabase error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Waitlist error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
