"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        router.replace("/login");
      }
    };

    signOut();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">
        Signing you out…
      </p>
    </main>
  );
}
