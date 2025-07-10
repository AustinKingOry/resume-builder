
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Optionally: store user in DB
    return redirect('/builder');
  } else {
    return redirect('/login');
  }
}
