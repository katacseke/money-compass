'use server';

import { revalidateTag } from 'next/cache';

import { ActionResponse } from '@/lib/types/transport.types';
import { createServerSupabaseClient } from '@/lib/utils/supabase/server';

interface UpdateProfileParams {
  mainCurrency: string;
}

export async function updateProfile(params: UpdateProfileParams): Promise<ActionResponse> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('profiles').upsert({ main_currency: params.mainCurrency });

  if (error) {
    return { success: false, error: { code: error.code, message: error.message } };
  }

  revalidateTag('profiles');
  return { success: true };
}
