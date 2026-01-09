import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      // Still redirect even if there's an error to clear client state
    }
    
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/`, { status: 303 });
  } catch (error) {
    console.error('Sign out exception:', error);
    // Fallback redirect on error
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/`, { status: 303 });
  }
}
