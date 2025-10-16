
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
        const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user?.id).single();
        // Create initial profile record
        if(!profile){
            await supabase.from("profiles").insert({
                user_id: session.user.id,
                full_name: session.user.user_metadata.full_name,
                email: session.user.email,
            })
        }
        return redirect('/resumes/builder');
    } else {
        return redirect('/login');
    }
}
