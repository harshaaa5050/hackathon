import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DoctorsContent } from "@/components/doctors-content";

export default async function DoctorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Source of truth: professional_profiles only — no legacy doctors table
  const { data: professionals, error } = await supabase
    .from("professional_profiles")
    .select(
      "id, full_name, email, role, specialization, years_experience, license_number, registration_type, bio, status, is_verified, created_at",
    )
    .order("is_verified", { ascending: false }) // verified first
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <DoctorsContent
        professionals={professionals ?? []}
        currentUserId={user.id}
      />
    </div>
  );
}
