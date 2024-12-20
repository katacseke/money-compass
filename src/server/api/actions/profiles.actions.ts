'use server';

import { revalidateTag } from 'next/cache';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/lib/types/transport.types';

interface UpdateProfileParams {
  mainCurrency: string;
}

export async function updateProfile(params: UpdateProfileParams): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user!.id, main_currency: params.mainCurrency });

  if (error) {
    return { success: false, error: { code: error.code, message: error.message } };
  }

  revalidateTag('profiles');
  return { success: true };
}
